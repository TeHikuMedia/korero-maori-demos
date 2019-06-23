import Vue from 'vue'
import Piki from '@/components/Piki'
import vueCustomElement from 'vue-custom-element'
Vue.use(vueCustomElement)
Vue.customElement('vue-widget', Piki)
