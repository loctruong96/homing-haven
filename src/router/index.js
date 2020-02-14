import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/components/Login'
import Registration from '@/components/Registration'
import Dashboard from '@/components/Dashboard'
import UDashboard from '@/components/UDashboard'
import Settings from '@/components/Settings'
import UserInfo from '@/components/UserInfo'

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
      component: UDashboard
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
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
});

export default router
