import Vue from 'vue'
import Korero from '@/components/Korero'
import vueCustomElement from 'vue-custom-element'
Vue.use(vueCustomElement)
Vue.customElement('vue-widget', Korero)
