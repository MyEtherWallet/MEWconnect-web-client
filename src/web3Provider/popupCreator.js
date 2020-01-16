import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'



export function generateElement(){
  const CustomElement = wrap(Vue, () => import(`popup.vue`))
  window.customElements.define('my-element', CustomElement)

}