Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <router-link class="navbar-brand" to="/">App Name</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" 
        data-target="#menuOptions" aria-controls="menuOptions" 
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="menuOptions">
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

const Home = Vue.component('home', {
    template: `
    <div>
        <h1>Home</h1>
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
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router
});