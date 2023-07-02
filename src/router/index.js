import Vue from 'vue'
import VueRouter from 'vue-router'
import createTask from '../components/createTask'
import Login from '../components/login'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: createTask
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history', // Add this line to enable history mode
  routes
})


export default router
