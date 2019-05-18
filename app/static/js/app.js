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
  </div>
  `,
  props: ['resource']
});

Vue.component('resource-listing', {
  template: `
  <section class="mb-4">
    <h1 class="font-weight-bold section-title">{{ title }}</h1>
    <div class="scrolling-wrapper">
      <resource-card v-for="resource in resources"></resource-card>
    </div>
  </section>
  `,
  props: ['title'],
  data: function() {
    return {
      resources: []
    }
  },
  created: function() {
      let self = this;

      fetch('', {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        console.log(data);
      })
    }
});

const Home = Vue.component('home', {
    template: `
    <div class="bg-pattern">
      <search></search>
      <resource-listing></resource-listing>
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
            <input type="text" name="country" class="form-control" placeholder="Enter Country">
          </div>
          <div class="form-group pr-2">
            <label>City</label>
            <input type="text" name="city" class="form-control" placeholder="Enter City">
          </div>
          <div class="form-group pr-2">
            <label>Start Date</label>
            <input type="date" id="startDate" name="startDate" class="form-control" placeholder="Start Date">
          </div>
          <div class="form-group pr-2">
            <label>End Date</label>
            <input type="date" id="endDate" name="endDate" class="form-control" placeholder="End Date">
          </div>
          <div class="form-group d-flex align-items-end">
            <input type="submit" value="Submit" class="btn btn-primary font-weight-bold">
          </div>
      </form>
    </div>
  </div>
	`,
	created: function() {
		fetch('http://api.opencaribbean.org/api/v1/location/countries', {
			method: 'GET',
			header: {
				'X-CSRFToken': token,
			},
			credentials: 'same-origin'
		}).then()
	},
	methods: {
		search: function() {
			let form = document.querySelector('form');
			let startDate =document.getElementById("startDate");
			let endDate =document.getElementById("endDate");
			formData = new FormData(form);
			let s = new Date(startDate.value).toISOString();
			let e = new Date(endDate.value).toISOString();
      formData.set("startDate", s);
			formData.set("endDate", e);

			fetch('http://api.opencaribbean.org/api/v1/playtour/resource/page/availables', {
				method: 'POST',
				body: formData,
				header: {
					'X-CSRFToken': token
				},
				credentials: 'same-origin'
			}).then(resp => resp.json()).then(jsonResp => {
				console.log(jsonResp);
			});
      
      fetch('/api/bookables', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': token,
        },
        credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        console.log(jsonResponse);
        router.push({name: 'available', params:{bookable_data: jsonResponse}});
      })
      .catch(function (error) {
        console.log(error);
      })
		}
	}
});

const Available = Vue.component('available', {
  template: `
  <div>
  </div>
  `,
  created: function() {
    let self = this;
    
    let bk = JSON.parse(this.bookable_data);
    bk.forEach(bookable=> {
      fetch(`api/bookables/${bookable.bookableId}`, {
        method: 'GET',
        headers: {

        },
        credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        console.log(jsonResponse)
      })
      .catch(function (error) {
        console.log(error);
      });
    })
  },
  props: ['bookable_data'],
  data: function() {
    return {};
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

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home, props: true},
        {path: "/login", name: "login", component: Login, props: true},
        {path: "/register", name: "register", component: Register, props: true},
        {path: "/available", name: "available", component: Available, props: true},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router
});