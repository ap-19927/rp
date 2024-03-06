//https://stackoverflow.com/questions/74477187/how-to-implement-auth0-with-nuxt3
import { createAuth0 } from '@auth0/auth0-vue';

const plugin = (nuxtApp) => {
  const config = useRuntimeConfig();
  const auth0 = createAuth0({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0Clientid,
    authorizationParams: {
      redirect_uri: config.public.auth0Redirecturi,
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
