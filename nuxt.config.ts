// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "src/",
  routeRules: {
    "/": { ssr: false },
  },
  runtimeConfig: {
    ghSecretKey: "",

    public: {
      auth0Domain: "",
      auth0Clientid: "",
      auth0Redirecturi: "",
    }
  },
})
