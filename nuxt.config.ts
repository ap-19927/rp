// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true, },
  srcDir: "src/",
  routeRules: {
    "/": { ssr: false, },
  },
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: "authjs",
    },
  },
  runtimeConfig: {
    ghSecretKey: "",
    geoapifyKey: "",

    secret: "",

    githubClientId: "",
    githubClientSecret: "",
  },
})
