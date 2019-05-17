Vue.config.ignoredElements = ['ion-icon'];

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-md navbar-light bg-transparent mb-2">
      <router-link class="navbar-brand title-font" to="/">DevCa</router-link>
    
      <div class="collapse navbar-collapse d-sm-none d-md-block">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
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

Vue.component('header-mast', {
  template: `
  <div class="jumbotron jumbotron-fluid">
    <div class="container d-flex flex-column justify-content-center align-items-center">
      <h1>Lorem Ipsum</h1>
      <div class="d-flex flex-row justify-content-center align-items-center">
        <input type="text" class="form-control">
        <button class="btn btn-primary">Search</button>
      </div>
    </div>
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
    <div>
      <header-mast></header-mast>
      <resource-listing></resource-listing>
    </div>
    `
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
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router
});