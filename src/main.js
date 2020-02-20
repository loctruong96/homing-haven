import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import './assets/scss/app.scss';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
const fb = require('./firebaseConfig.js');
// library.add(faUserSecret);
// Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(ElementUI);
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
