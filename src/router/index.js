import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/components/Login'
import Registration from '@/components/Registration'
import Dashboard from '@/components/Dashboard'
import UDashboard from '@/components/UDashboard'
import Settings from '@/components/Settings'
import UserInfo from '@/components/UserInfo'
import NewComm from '@/components/NewComm'
import NewRec from '@/components/NewRec'
import Community from '@/components/Community'
import NotFound from '@/components/NotFound'
import Resource from "../components/Resource";
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/udashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path:'/registration',
      name: 'Registration',
      component: Registration
    },
    {
      path:'/udashboard',
      name: 'UDashboard',
      component: UDashboard,
      meta: {
        title: "Dashboard"
      }
    },
    {
      path: '/userinfo',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: "Dashboard"
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true,
        title: "Settings"
      }
    },
    {
      path: '/newcomm',
      name: 'NewComm',
      component: NewComm,
      meta: {
        requiresAuth: true,
        title: "New Community"
      }
    },
    {
      path: '/newrec',
      name: 'NewRec',
      component: NewRec,
      meta: {
        requiresAuth: true,
        title: "New Resource"
      }
    },
    {
      path: '/community/:id',
      name: 'Community',
      component: Community,
      meta: {
        requiresAuth: false,
        title: "Community"
      }
    },
    {
      path: '/resource/:id',
      name: 'Resource',
      component: Resource,
      meta: {
        requiresAuth: false,
        title: "Resource"
      }
    },
    {
      path: '/NotFound/',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: "Not Found"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;
  document.title = to.meta.title || 'Homing Haven';
  if (requiresAuth && !currentUser) {
    next('/login')
  } else if(to.name === 'UDashboard' && currentUser){
    next('/dashboard')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
});

export default router
