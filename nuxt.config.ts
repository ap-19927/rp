// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "src/",
   routeRules: {
     '/': { ssr: false },
   },
   css: ['~/assests/css/index.css'],
})