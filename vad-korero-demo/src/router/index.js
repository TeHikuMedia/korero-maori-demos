import Vue from 'vue'
import Router from 'vue-router'
import Korero from '@/components/Korero'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VAD Kōrero Māori API Demo',
      component: Korero
    }
  ]
})
