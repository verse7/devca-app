Vue.config.ignoredElements = ['ion-icon'];

const store = new Vuex.Store({
  state: {
    resources: []
  },
  getters: {
    resources: (state) => {
      return state.resources;
    },
    typeResources: (state) => (type) => {
      if (type === 'More') {
        return state.resources.filter(
          resource => resource.Location_Type !== 'Accomodation' &&
                      resource.Location_Type !== 'Attraction' &&
                      resource.Location_Type !== 'Services');
      }
      return state.resources.filter(resource => resource.Location_Type === type);
    }
  },
  mutations: {
    updateResources: (state, resources) => {
      state.resources = resources;
    }
  }
});

Vue.component('app-header', {
    template: `
    <nav id="mainNav" class="navbar navbar-expand-md navbar-light bg-transparent fixed-top">
      <router-link class="navbar-brand title-font" to="/">DevCa</router-link>
    
      <button @click="extendNav" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/explore">Explore</router-link>
          </li>
          <li class="nav-item" v-if="!logged">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item" v-if="!logged">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="logged">
            <router-link class="nav-link" to="/calendar">Calendar</router-link>
          </li>
          <li class="nav-item" v-if="logged">
            <router-link class="nav-link" to="/itinerary">Itinerary</router-link>
          </li>
          <li class="nav-item" v-if="logged">
            <router-link class="nav-link" to="/logout">Logout</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,
    created: function() {
      this.logged = localStorage.getItem('current_user') !== null;
    },
    data: function(){
      return {
        logged: false,
        isCollapsed: true
      }
    },
    methods: {
      extendNav: function() {
        const nav = document.getElementById('mainNav');

        this.isCollapsed = !this.isCollapsed;

        nav.classList.toggle('bg-transparent');
        nav.classList.toggle('bg-white');
      }
    }
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
          <router-link to="/itinerary">
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
    <app-header></app-header>
    <div class="bg-pattern mb-4">
      <div role="alert" v-if='success' style="padding: 50px 0 0 80px;">
        <div class="alert alert-success col-md-7">
          {{ notifs }}
        </div>
      </div>
      <search></search>
    </div>
    <div class="container">
      <default-listing title="Hotels" type="HOTEL"></default-listing>
      <default-listing title="Vill" type="MOTEL"></default-listing>
    </div>
  </div>
  `,
  props: ['notifs', 'success'],
  data: function() {
    return {};
  }
});

const Register = Vue.component('register', {
  template: `
  <div>
    <app-header></app-header>
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
    <app-header></app-header>
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

const Logout = Vue.component('logout', {
  template:`<div></div>`,
  created: function(){
    let message;
    localStorage.clear();
    message = "User successfully logged out";
    router.push({name: 'home', params:{notifs: message, success: true}});
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

const Itinerary = Vue.component('itinerary', {
	template:`
	<div>
		<h2 class="mb-2">My Itinerary</h2>
		<ul class="list-group" v-if="bookings.length">
			<li v-for="booking in bookings" class="list-group-item">{{booking.idresource}}</li>
		</ul>
	</div>
	`,
	data: function() {
		bookings: []
	},
	methods: {

	},
	created: function(){
			fetch('http://api.opencaribbean.org/api/v1/booking/bookings/history?iduser=' + localStorage.current_user)
			.then( resp => resp.json()).then(jsonResp => {
				this.bookings = jsonResp.content;
			});

			// this.bookings.forEach(b => {
			// 	fetch(`http://api.opencaribbean.org/api/v1/playtour/resource/${b.idresource}`)
			// 	.then( resp => resp.json()).then(jsonResp => {
			// 		console.log(`supposed resources ${jsonResp.content}`);
			// 		b.name = jsonResp.content.name;
			// 	});
			// }) ;
	}
});

const Calendar = Vue.component('calendar' , {
  template: `
  <div class="calendar">
    <app-header></app-header>
    <div class="month">
      <ul>
        <li class="prev"><ion-icon name="arrow-dropleft" @click="subtractMonth"></ion-icon></li>
        <li class="next"><ion-icon name="arrow-dropright" @click="addMonth"></ion-icon></li>
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
      <app-header></app-header>
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

        <!-- BOOKING LIST HERE -->
        <div class="form pb-3">
          <label for="book-sel">Select Booking Period: </label>
          <select class="form-control" id="book-sel" v-model="selBooking">
            <option v-for="bookable in bookables" :value="bookable">{{ new Date(bookable.dateStart).toUTCString() }} --> {{ new Date(bookable.dateEnd).toUTCString() }}</option>
          </select> 
        </div>
        
         <button @click="bookStay" class="btn btn-dark btn-size pl-5 mb-4 d-flex align-items-center" type="submit" data-dismiss="modal">Book</button>
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
  data: function(){
    return{
      bookables: [],
      selBooking: null
    }
  },
  methods: {
    bookStay: function() {
      let select = document.querySelector("select");
      if(localStorage.getItem('current_user') !== null){
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
						headers: {
							'X-CSRFToken': token,
							'content-type': 'application/json;charset=UTF-8',
						},
						credentials: 'same-origin'
				})
				.then(res => res.json())
				.then(jsonResp => {
						console.log(jsonResp);
				});
        
      }else{
        if(select.length == 0){
          alert("Must select a booking time from list before booking " + this.resource.type);
        }else{
          router.push('login');
        }
      }
    }
  },
  created: function(){
    this.bookables = this.resource.bookeableList;
    console.log(this.bookables);
  }      
});

const ExploreMapFooter = Vue.component('map-footer', {
  template: `
  <footer id="navCentre"
    class="fixed-bottom bg-white rounded-top-xtra 
          shadow-sm nav-centre d-flex flex-column 
          align-items-center">
    <div @click="extendNavCentre" class="clickable notch mt-2"></div>
    <div class="container pt-3 pl-3 pr-3 d-flex flex-row justify-content-between align-items-center overflow-x-scroll">
        <category-icon title="Stays" type="Accomodation" icon="business"></category-icon>
        <category-icon title="Attractions" type="Attraction" icon="paper"></category-icon>
        <category-icon title="Services" type="Services" icon="build"></category-icon>
        <category-icon title="More" type="More" icon="code-working"></category-icon>
    </div>
  </footer>
  `,
  data: function() {
    return {
      isExtended: false,
    }
  },
  methods: {
    extendNavCentre: function() {
      this.isExtended = !this.isExtended;

      const nv = document.getElementById('navCentre');

      nv.style.height = this.isExtended ? '300px' : '100px';
    }
  }
});

const CategoryIcon = Vue.component('category-icon', {
  template: `
    <div @click="filterResources" class="clickable d-flex flex-column justify-content-center align-items-center">
      <div style="background-color: #007bff;"
        class="shadow-sm rounded-circle type-icon d-flex justify-content-center align-items-center text-white">
        <ion-icon :name="icon"></ion-icon>
      </div>
      <small class="text-muted">{{ title }}</small>
    </div>
  `,
  props: ['title', 'type', 'icon'],
  methods: {
    filterResources: function() {
      const results = this.$store.getters.typeResources(this.type);
      this.$emit('filter-resources', results);
      console.log(results);
    }
  }
});

const ExploreMapHeader = Vue.component('map-header', {
  template: `
  <nav class="navbar navbar-expand-lg navbar-light bg-transparent fixed-top">
    <div class="input-group shadow-sm text-small">
    <div class="input-group-prepend">
      <router-link to="/" class="btn btn-primary d-flex justify-content-center align-items-center">
        <ion-icon name="arrow-round-back"></ion-icon>
      </router-link>
    </div>
      <input type="text" v-model="searchTerm"
        class="form-control text-small" placeholder="Search Treasure Beach...">
      <div class="input-group-append">
        <button @click="searchResources" class="btn btn-primary text-center d-flex justify-content-center align-items-center" type="button">
          <ion-icon name="search"></ion-icon>
        </button>
        <button @click="getDirections" class="btn btn-info text-center d-flex justify-content-center align-items-center" type="button">
          <ion-icon name="compass"></ion-icon>
        </button>
      </div>
    </div>
  </nav>
  `,
  data: function() {
    return {
      searchTerm: ''
    }
  },
  methods: {
    searchResources: function() {
      console.log(this.searchTerm);
    },
    getDirections: function() {
      console.log(this.searchTerm);
    }
  }
});

const Explore = Vue.component('explore', {
    template: `
    <div>
        <map-header></map-header>
        <div id="map" v-on:filter-resources="updateMarkers"></div>
        <map-footer></map-footer>
    </div>
    `,
    data: function() {
      return {
        accessToken: 'pk.eyJ1IjoiemRtd2kiLCJhIjoiY2l6a3EyOW1wMDAzbjJ3cHB2aHQ5a2N1eCJ9.xOIXUuzA4pJt7cLIR-wUSg',
        lat: 17.8871132,
        lng: -77.7639855,
        zoom: 14,
        map: null,
      }
    },
    methods: {
      updateResources : function(resources) {
        this.$store.commit('updateResources', resources);
      },

      updateMarkers: function(resources) {
        let self = this;
      }
    },
    mounted: function() {
      let self = this;

      self.map = L.map('map', {
        zoomControl: false
      }).setView([this.lat, this.lng], this.zoom);
  
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token='+ this.accessToken, {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: this.accessToken
      }).addTo(self.map);

      fetch('/api/resources', {
        method: 'GET'
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        self.updateResources(data);

        console.log(data);

        self.$store.getters.resources.forEach(resource => {
          L.marker([resource._Location_latitude, resource._Location_longitude])
          .bindPopup(`
          <div style="width: 150px;">
            <!-- <img src="api.opencaribbean.org/api/v1/media/download/${resource.Images}" class="card-img-top" alt="..."> -->
            <div class="card-body p-0">
              <h5 class="card-title">${resource.Name}</h5>
              <p class="card-text">${resource.Description}</p>
            </div>
          </div>
          `)
          .openPopup()
          .addTo(self.map);
        })
      });
    }
});

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home, props: true},
        {path: "/calendar", component: Calendar},
        {path: "/login", name: "login", component: Login, props: true},
        {path: "/logout", component: Logout},
        {path: "/register", name: "register", component: Register, props: true},
        {path: "/results", name: "results", component: ResourcePicker, props: true},
				{path: "/details", name: "details", component: ResourceDetails, props: true},
        {path: "/itinerary", name:"itinerary", component: Itinerary},
        {path: "/explore", name: "explore", component: Explore},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router,
    store,
    components: {Explore, CategoryIcon, ExploreMapHeader, ExploreMapFooter}
});
