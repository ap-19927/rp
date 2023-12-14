// https://stackoverflow.com/a/70193023
// plugins/vue3-openlayers.client.js
import { defineNuxtPlugin } from '#app'
import OpenLayers from 'vue3-openlayers'
import Kompas from 'kompas'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(OpenLayers);
  nuxtApp.vueApp.use(Kompas);
})
