<script setup lang="ts">
//https://stackoverflow.com/a/74694136
import { useAuth0 } from '@auth0/auth0-vue'

// Composition API
const auth0 = process.client ? useAuth0() : undefined;

const isAuthenticated = computed(() => {
  return auth0?.isAuthenticated.value
})

const login = () => {
  auth0?.checkSession()
  if (!auth0?.isAuthenticated.value) {
    auth0?.loginWithRedirect({
      appState: {
        target: useRoute().path,
      },
    })
  }
}

const logout = () => {
  navigateTo('/')
  auth0?.logout()
}
</script>

<template>
<div>
  <button
    v-if="!isAuthenticated"
    @click="login"
  >
    <slot>Log In</slot>
  </button>
  <button
    v-else
    @click="logout"
  >
    <slot>Log Out</slot>
  </button>
</div>
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>
