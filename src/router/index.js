// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import LessonList from '../components/LessonList.vue'
import CheckoutPage from '../components/CheckoutPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lessons',
    name: 'Lessons',
    component: LessonList
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router