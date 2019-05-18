Vue.config.ignoredElements = ['ion-icon'];

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-md navbar-light bg-transparent fixed-top">
      <router-link class="navbar-brand title-font" to="/">DevCa</router-link>
    
      <div class="collapse navbar-collapse d-sm-none d-md-block">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <div class="shadow-sm bg-white d-sm-block d-md-none py-3 fixed-bottom">
      <ul class="d-flex flex-row justify-content-around align-items-center text-center">
        <li>
          <router-link to="/">
            <ion-icon class="text-dark tab-icon" name="home"></ion-icon>
          </router-link>
        </li>
        <li>
          <router-link to="/events/create">
            <ion-icon class="text-dark tab-icon" name="add"></ion-icon>
          </router-link>
        </li>
        <li>
          <router-link to="/events/popular">
            <ion-icon class="text-dark tab-icon" name="pulse"></ion-icon>
          </router-link>
        </li>
        <li>
          <router-link to="/profile">
            <ion-icon class="text-dark tab-icon" name="person"></ion-icon>
          </router-link>
        </li>
      </ul>
    </div>
    `
});

Vue.component('resource-card', {
  template: `
  <div class="card mr-2 bg-transparent text-dark">
    <span @click="selectResource">
      <img class="card-img img-fluid" 
          :src="'http://api.opencaribbean.org/api/v1/media/download/' + resource.mainImage">
    </span>
    <small class="mt-1 font-weight-bold">{{ resource.name }}</small>
  </div>
  `,
  props: ['resource'],
  methods: {
    selectResource: function(){
        console.log(this.resource.appId);
        // localStorage.setItem(this.type, JSON.stringify(this.resource));
        // console.log(JSON.parse(localStorage.getItem(this.type)));
    }
  }
});


Vue.component('default-listing', {
  template: `
  <section class="mb-4">
    <h1 class="font-weight-bold section-title">{{ title }}</h1>
    <div class="scrolling-wrapper">
      <resource-card v-for="resource in resources" :resource="resource" :key="resource.id"></resource-card>
    </div>
  </section>
  `,
  props: ['title', 'type'],
  data: function() {
    return {
      resources: []
    }
  },
  created: function() {
      let self = this;

      fetch('http://api.opencaribbean.org/api/v1/playtour/resource/search?query=' + self.type, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        console.log(data);
        self.resources = data;
      })
		}
	});

const Home = Vue.component('home', {
    template: `
    <div>
      <div class="bg-pattern mb-4">
        <search></search>
      </div>
      <div class="container">
        <default-listing title="Hotels" type="HOTEL"></default-listing>
        <default-listing title="Vill" type="MOTEL"></default-listing>
      </div>
    </div>
    `
});

const Register = Vue.component('register', {
  template: `
  <div>
    <h4 class="font-weight-bold">Registration</h4>
    <form id="registerForm" method="post" @submit.prevent="register" enctype="multipart\form-data">
      <div class="form-group">
        <label class="font-weight-bold">Firstname</label>
        <input type="text" name="firstname" class="form-control">
      </div>
      <div class="form-group">
        <label class="font-weight-bold">Lastname</label>
        <input type="text" name="lastname" class="form-control">
      </div>
      <div class="form-group">
        <label class="font-weight-bold">Email</label>
        <input type="email" name="email" placeholder="eg. johndoe@test.com" class="form-control">
      </div>
      <div class="form-group">
        <label class="font-weight-bold">Password</label>
        <input type="password" name="password" class="form-control">
      </div>
      <div class="form-group">
        <label class="font-weight-bold">Photo</label>
        <input type="file" name="photo" class="form-control-file">
      </div>
      <input type="submit" name="register" value="Submit" class="btn btn-primary">
    </form>
  </div>
  `,
  methods: {
    register: function() {
      let self = this;
      let registerForm = document.getElementById('registerForm');
      let registerInfo = new FormData(registerForm);

      fetch("/api/register", {
        method: 'POST',
        body: registerInfo,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        if(jsonResponse.hasOwnProperty('message')){
          router.push('/login');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
});

const Login = Vue.component('login', {
  template: `
  <div>
    <h4 class="font-weight-bold">Login</h4>
    <form id="loginForm" method="post" @submit.prevent="login">
      <div class="form-group">
        <label class="font-weight-bold">Email</label>
        <input type="email" class="form-control" name="email" placeholder="johndoe@test.com">
      </div>
      <div class="form-group">
        <label class="font-weight-bold">Password</label>
        <input type="password" class="form-control" name="password">
      </div>
      <input type="submit" value="Login" class="btn btn-primary font-weight-bold">
    </form>
  </div>
  `,
  methods: {
    login: function() {
      let self = this;
      let loginForm = document.getElementById('loginForm');
      let loginInfo = new FormData(loginForm);


      fetch("/api/auth/login", {
        method: 'Post',
        body: loginInfo,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(function (response){
        return response.json();
      })
      .then(function (jsonResponse){
        console.log(jsonResponse);
        if(jsonResponse.hasOwnProperty('message')){
          let jwt_token = jsonResponse.token;
          let id = jsonResponse.user_id;

          /*Stores the jwt locally to be accessed later*/
          localStorage.setItem('token', jwt_token);
          localStorage.setItem('current_user', id);

          router.push('/');
        }
      })
      .catch(function (error){
        console.log(error);
      })
    }
  }
});

const Search = Vue.component('search', {
  template: `
  <div>
    <div class="search-form">
      <p class="font-weight-bold">Search Details Below</p>
      <h4 class="font-weight-bold">Book Your Next Adventure</h4>
      <form class="row pl-3" @submit.prevent="search" method="post">
          <div class="form-group pr-2">
            <label>Country</label>
            <input id="country" type="text" v-on:blur="findCountry" name="country" class="form-control" placeholder="Enter Country">
          </div>
          <div class="form-group pr-2">
            <label>Start Date</label>
            <input type="date" id="startDate" name="startDate" class="form-control"placeholder="Start Date">
          </div>
          <div class="form-group pr-2">
            <label>End Date</label>
            <input type="date" id="endDate" name="endDate" class="form-control"placeholder="End Date">
          </div>
          <div class="form-group d-flex align-items-end">
            <input type="submit" value="Search" class="btn btn-primary">
          </div>
      </form>
    </div>
  </div>
  `,
  data: function() {
    return {
      countryId: ''
    }
  },
	methods: {
    findCountry: function() {
      let self = this;
      let country = document.getElementById('country').value;

      fetch('https://api.opencaribbean.org/api/v1/location/countries/search?name='+ country +'&page=0&size=1', {
        method: 'GET'
      })
      .then(function(res) {
        return res.json();
      })
      .then(function (jsonResponse) {
        console.log(jsonResponse)
        self.countryId = jsonResponse.content[0]['id']
      })
      .catch(function(err) {
        console.log(err);
      })
    },
		search: function() {
			let self = this;
			let startDate =document.getElementById("startDate");
      let endDate =document.getElementById("endDate");
      
			let s = new Date(startDate.value).toISOString();
			let e = new Date(endDate.value).toISOString();
			
			localStorage.setItem('startDate', s);
			localStorage.setItem('endDate', e);
      
      fetch('http://api.opencaribbean.org/api/v1/playtour/resource/page/availables?countryId='+ self.countryId +'&startDate='+ s +'&endDate='+ e +'&onlybookable=true&page=0&size=100', {
        method: 'GET'
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        console.log(jsonResponse);
				//filter responses here to find resources with accommodations
				router.push({name:"results", params:{resources: jsonResponse.content}});
      })
      .catch(function (error) {
        console.log(error);
      })
		}
	}
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

const ResourcePicker = Vue.component('resource-picker', {
  template: `
    <div class="pl-5 pr-5" style="margin-top: 80px;">
      <div class="p-4" v-for="category in Object.entries(filteredItems)">
        <h1>{{ category[0] }}</h1>
        <div v-if="category[1].length" class="scrolling-wrapper pt-3">
          <resource-card v-for="resource in category[1]" :resource="resource" :key="resource.id" ></resource-card>
        </div>
        <div v-else>
          No results
        </div>
      </div>      
    </div>
  `,
  props: ['type', 'resources'],
  data: function(){
    return {
      filteredItems: {Accommodation: [], Attraction: [], Service: [], Tour: [], Event: [], Transportation_Operators: []},
      // accomodation: [],
      // attraction: [],
      // service: [],
      // tour: [],
      // event: [],
      // transportation_operators: [],
      empty: false
    }
  },
  methods: {
    isEmpty: function(){
			this.empty = this.filteredItems.length === 0;
		},
		selectResource: function(resource) {
			this.selectResource = resource;
			bookStay();
		},
		bookStay: function() {
			let bookingForm = new FormData();
			bookingForm.append("bookableId", this.selectResource.bookeableList[0].bookableId);
			bookingForm.append("dateend", localStorage.endDate);
			bookingForm.append("datestart", localStorage.startDate);
			bookingForm.append("idapp", this.selectResource.appId);
			bookingForm.append("idresource", this.selectResource.id);
			bookingForm.append("iduser", localStorage.getItem('current_user'));
			bookingForm.append("status", "CREATED");


			fetch('https://api.opencaribbean.org/api/v1/booking/bookings', {
				method: 'POST', 
				body: bookingForm,
				credentials: 'same-origin'
			})
			.then(res => res.json())
			.then(jsonResp => {
				console.log(jsonResp);
			});
		}
  },
  created: function(){
      this.resources.forEach(element => {
        if(this.filteredItems[element['__type']] != null){
          this.filteredItems[element['__type']].push(element)
        }
      });
  }
})

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home, props: true},
        {path: "/login", name: "login", component: Login, props: true},
        {path: "/register", name: "register", component: Register, props: true},
        {path: "/results", name: "results", component: ResourcePicker, props: true},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router
});