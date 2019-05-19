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
          <li class="nav-item">
            <router-link class="nav-link" to="/calendar">Calendar</router-link>
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
	<div>
		<div class="card mr-4 bg-transparent text-dark" > 
			<img class="card-img img-fluid"
					:src="'http://api.opencaribbean.org/api/v1/media/download/' + resource.mainImage">
			<small class="mt-1 font-weight-bold">{{ resource.name }}</small>
		</div>
		
	</div>
  `,
  props: ['resource'],
  methods: {
    selectResource: function(){
			console.log(this.resource.appId);
			// localStorage.setItem(this.type, JSON.stringify(this.resource));

			// console.log(JSON.parse(localStorage.getItem(this.type)));
			router.push({name:"details", params:{resource: this.resource}});
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
    <div class="d-flex justify-content-center bg-pattern" style="padding-top: 80px;">
      <div class="d-flex justify-content-start pb-3" style="width: 75%">
        <h4 class="font-weight-bold">Registration</h4>
      </div>
    </div>
    <div class="alert alert-danger container pl-5 mt-5" role="alert" v-if="error">
      {{ message }}
    </div>
    <div class="container pl-5 mt-5">
      <form class="col-md-5" id="registerForm" method="post" @submit.prevent="register" enctype="multipart\form-data">
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
        <div class="form-group pb-3">
          <label class="font-weight-bold">Photo</label>
          <input type="file" name="photo" class="form-control-file">
        </div>
        <input type="submit" name="register" value="Submit" class="btn btn-primary btn-block font-weight-bold">
      </form>
    </div>
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
        if (jsonResponse.hasOwnProperty("error")){
          self.error = true;
          self.message = jsonResponse.error;
        }else{
          if(jsonResponse.hasOwnProperty('message')){
            router.push({name: 'login', params: {notifs: jsonResponse.message, success: true}});
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  },
  data: function(){
    return {
      error: false,
      message: ''
   };
  }
});

const Login = Vue.component('login', {
  template: `
  <div>
    <div class="d-flex justify-content-center bg-pattern" style="padding-top: 80px;">
      <div class="d-flex justify-content-start pb-3" style="width: 75%">
        <h4 class="font-weight-bold">Login</h4>
      </div>
    </div>
    <div class="alert alert-danger container pl-5 mt-5" role="alert" v-if='error'>
      {{ message }}
    </div>
    <div v-else>
      <div class="alert alert-success container pl-5 mt-5" role="alert" v-if='success'>
        {{ notifs }}
      </div>
    </div>
    <div class="container pl-5 mt-5">
      <form class="col-md-5" id="registerForm" id="loginForm" method="post" @submit.prevent="login">
        <div class="form-group">
          <label class="font-weight-bold">Email</label>
          <input type="email" class="form-control" name="email" placeholder="johndoe@test.com">
        </div>
        <div class="form-group">
          <label class="font-weight-bold">Password</label>
          <input type="password" class="form-control" name="password">
        </div>
        <input type="submit" value="Login" class="btn btn-primary btn-block font-weight-bold">
      </form>
    </div>
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
        if(jsonResponse.hasOwnProperty('token')){
          let jwt_token = jsonResponse.token;
          let id = jsonResponse.user_id;

          /*Stores the jwt locally to be accessed later*/
          localStorage.setItem('token', jwt_token);
          localStorage.setItem('current_user', id);

          router.push('/');
        }else{
          self.error = true;
          self.message = jsonResponse.error;
        }
      })
      .catch(function (error){
        console.log(error);
      })
    }
  },
  props: ['notifs', 'success'],
  data: function(){
    return {
      error: false,
      message: ''
    };
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
				
        //router.push({name:"results", params:{resources: jsonResponse.content}});
        
        localStorage.setItem('resources', JSON.stringify(jsonResponse.content));
        router.push("/results");
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

const Calendar = Vue.component('calendar' , {
  template: `
  <div class="calendar">
    <div class="month">
      <ul>
        <li class="prev"><ion-icon name="arrow-dropleft"></ion-icon></li>
        <li class="next"><ion-icon name="arrow-dropright"></ion-icon></li>
        <li>{{ month }}<br><span style="font-size:18px">{{year}}</span></li>
      </ul>
    </div>

    <ul class="weekdays">
      <li v-for="day in days">{{ day }}</li> 
    </ul>

    <ul class="days">
      <li v-for="blank in firstDayOfMonth"></li>
      <li v-for="date in daysInMonth">{{date}}</li> 
    </ul>
    
  </div>
  `,
  data: function(){
    return {
      today: moment(),
      dateContext: moment(),
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    }
  },
  computed: {
    year: function () {
      var t = this;
      return t.dateContext.format('Y');
    },
    month: function () {
      var t = this;
      return t.dateContext.format('MMMM');
    },
    daysInMonth: function () {
      var t = this;
      return t.dateContext.daysInMonth();
    },
    currentDate: function () {
        var t = this;
        return t.dateContext.get('date');
    },
    firstDayOfMonth: function () {
        var t = this;
        var firstDay = moment(t.dateContext).subtract((t.currentDate - 1), 'days');
        return firstDay.weekday();
    },
    initialDate: function () {
      var t = this;
      return t.today.get('date');
    },
    initialMonth: function () {
        var t = this;
        return t.today.format('MMMM');
    },
    initialYear: function () {
        var t = this;
        return t.today.format('Y');
    }
  },
  methods: {
    addMonth: function () {
      var t = this;
      t.dateContext = moment(t.dateContext).add(1, 'month');
    },
    subtractMonth: function () {
        var t = this;
        t.dateContext = moment(t.dateContext).subtract(1, 'month');
    }
  }
});

const ResourcePicker = Vue.component('resource-picker', {
	template: `
    <div>
      <div class="bg-pattern">
        <div style="padding: 80px 0 30px 80px;">
          <p class="font-weight-bold"> Search Results Below </p>
          <h4 class="font-weight-bold"> Avaible Bookings: {{ start }} - {{ end }} </h4>
        </div>
      </div>
			<div class="container" style="margin-top: 80px;">
				<div class="card shadow-sm p-4 mb-5 rounded" v-for="category in Object.entries(filteredItems)" style="width: 100%">
					<h4 class="font-weight-bold">{{ category[0] }}</h4>
					<div v-if="category[1].length" class="scrolling-wrapper pt-3">
						<a v-for="resource in category[1]" data-toggle="modal" href="#myModal" @click="select(resource, $event)">
							<resource-card :resource="resource" :key="resource.id" v-on:click="select(resource)"></resource-card>
						</a>
					</div>
					<div v-else>
						No results
					</div>
				</div>     
			</div>

			<div class="modal fade" id="myModal" v-if="selectedResource !== null">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
						</div>
						<div class="model-body">
							<resource-details :resource="selectedResource"></resource-details>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
  `,
  data: function(){
    return {
      filteredItems: {Accommodation: [], Attraction: [], Service: [], Tour: [], Event: [], Transportation_Operators: []},
			empty: false,
      selectedResource: null,
      start: '',
      end: '',
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  },
  methods: {
		select: function(res, event) {
			console.log('select function called');
			event.preventDefault();
			console.log(res);
			this.selectedResource = res;
			event.returnValue = true;
		}
  },
  created: function(){
    let self = this;
    let resources = JSON.parse(localStorage.getItem('resources'));	
		resources.forEach(element => {
			if(self.filteredItems[element['__type']] != null){
				self.filteredItems[element['__type']].push(element)
			}
    });
    let s = (localStorage.getItem('startDate')).split(/\D+/);
    let e = (localStorage.getItem('endDate')).split(/\D+/);
    s = new Date(Date.UTC(s[0], --s[1], s[2], s[3], s[4], s[5], s[6]));
    e = new Date(Date.UTC(e[0], --e[1], e[2], e[3], e[4], e[5], e[6]));
    this.start = self.months[s.getMonth()]+" "+(s.getDate()+1)+", "+s.getFullYear();
    this.end = self.months[e.getMonth()]+" "+(e.getDate()+1)+", "+e.getFullYear();
  }
});

const ResourceDetails = Vue.component('resource-details', {
  template: `
  <div>
    <div class="card mb-3 pl-5 pr-5 bg-pattern" style="width: 100%;">
      <div class="row no-gutters" style="padding: 80px 0 0 20px;">
        <div class="col-md-4 pb-5">
          <img :src="'http://api.opencaribbean.org/api/v1/media/download/' + resource.mainImage" class="card-img" alt="Image of resource"
          style="width: 90%; height: 100%;">
        </div>
        <div class="col-md-8 pb-5">
          <div class="card-body no-padding">
            <h5 class="card-title">{{ resource.name }}</h5>
            <p class="card-text">{{ resource.street }}</p>
            <p class="card-text">{{ resource.community }}, {{ resource.state }}</p>
            <p class="card-text">{{ resource.email }}</p>
            <p class="card-text">{{ resource.country.name }}</p>
            <p class="card-text"><small class="text-muted">Last updated {{ resource.updatedAt }}</small></p>
          </div>
        </div>
        <p class="card-text">{{ resource.description }}</p>
         <h4 class="font-weight-bold pr-5 pb-4">Select {{ resource.__type }}: </h4>
         <button @click="bookStay" class="btn btn-dark btn-size pl-5 mb-4 d-flex align-items-center" type="submit">Book</button>
      </div>
    </div>
    <div class="container">
      <ul class="row list-inline">
        <li class="col-sm-4" v-for="photo in resource.images">
          <div class="card-body">
            <img :src="'http://api.opencaribbean.org/api/v1/media/download/' + photo" alt="Additional Images of the resource" 
            class="img-fluid card-img-top">
          </div>
        </li>
      </ul>
    </div>
  </div>
  `,
  props: ['resource'],
  created: function(){
    console.log(this.resource);
  },
  methods: {
    bookStay: function() {
      let bookingForm = new FormData();
      bookingForm.append("bookableId", this.resource.bookeableList[0].bookableId);
      bookingForm.append("dateend", localStorage.endDate);
      bookingForm.append("datestart", localStorage.startDate);
      bookingForm.append("idapp", this.resource.appId);
      bookingForm.append("idresource", this.resource.id);
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
      })
      .catch(function(err){
        console.log(err);
      });
    }
  }
});

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home, props: true},
        {path: "/calendar", component: Calendar},
        {path: "/login", name: "login", component: Login, props: true},
        {path: "/register", name: "register", component: Register, props: true},
        {path: "/results", component: ResourcePicker},
        {path: "/details", name: "details", component: ResourceDetails, props: true},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router
});