// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "src/",
  routeRules: {
    '/': { ssr: false },
  },
  runtimeConfig: {
    ghSecretKey: '', // can be overridden by NUXT_API_SECRET environment variable
    public: {
      ghKey: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    }
  },
})
