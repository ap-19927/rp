//https://stackoverflow.com/questions/74477187/how-to-implement-auth0-with-nuxt3
import { createAuth0 } from '@auth0/auth0-vue';
const plugin = (nuxtApp) => {
  const auth0 = createAuth0({
    domain: "dev-ttmk3bqoecccd4fr.us.auth0.com",
    clientId: "kLwg0VWTjmQV4C4XSqUYosetzdwkC3lb",
    authorizationParams: {
      redirect_uri: "http://localhost:3000"
    }
  })

  nuxtApp.vueApp.use(auth0);

  addRouteMiddleware('auth', () => {
    if (process.client) {
      auth0.checkSession()
      if (!auth0.isAuthenticated.value) {
        auth0.loginWithRedirect({
          appState: {
            target: useRoute().path,
          },
        })
      }
    }
  })
}
export default defineNuxtPlugin(plugin);
