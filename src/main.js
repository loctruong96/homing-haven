import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import './assets/scss/app.scss';


const fb = require('./firebaseConfig.js');

Vue.config.productionTip = false;

//bootstrap
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Vue.use(BootstrapVue)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// import './custom.scss'

// handle page reloads
let app;
fb.auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
    });
  }
});
