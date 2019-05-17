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
            <router-link class="nav-link" to="/">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">Contact</router-link>
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
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
    template: `
    <div>
        <h1>Home</h1>
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

const Calendar = Vue.component('calendar' , {
  template: `
  <div class="calendar">
    <div class="calendar-header">
        <i class="fa fa-fw fa-chevron-left" @click="subtractMonth"></i>
        <h4>{{month + ' - ' + year}}</h4>
        <i class="fa fa-fw fa-chevron-right" @click="addMonth"></i>
    </div>
    <ul class="weekdays">
        <li v-for="day in days"></li>
    </ul>
    <ul class="dates">
        <li v-for="blank in firstDayOfMonth">&nbsp;</li>
        <li v-for="date in daysInMonth" 
        :class="{'current-day': date == initialDate &amp;&amp; month == initialMonth && year == initialYear}">;
            <span></span>
        </li>
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
})

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home, props: true},
        {path: "/calendar", component: Calendar},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

let app = new Vue({
    el: "#app",
    router
});