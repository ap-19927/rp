// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true, },
  srcDir: "src/",
  routeRules: {
    "/": { ssr: false, },
  },
  modules: ["@sidebase/nuxt-auth", "nuxt-security"],
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: "authjs",
    },
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https://tile.openstreetmap.org"],
      },
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
