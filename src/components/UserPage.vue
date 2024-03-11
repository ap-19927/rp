<template>
  <div>
    <div v-if="isLoading">Loading ...</div>
    <div v-else>
      <pre v-if="isAuthenticated">
        <div>
          <h2>Request Driver</h2>
          <button @click="request">
            <slot>Request</slot>
          </button>
          <code>{{ results }}</code>
        </div>
        <div>
          <h2>User Info</h2>
          <code>{{ user }}</code>
        </div>
      </pre>
    </div>
  </div>
</template>

<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';

  const auth0 = useAuth0();
  const isAuthenticated = ref(auth0.isAuthenticated);
  const login = ref(() => auth0.loginWithRedirect());
  const user = ref(auth0.user);
  const isLoading = ref(auth0.isLoading);

  const request = ref(null);
  const results = ref(null);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  const success = async (pos) => {
    const crd = pos.coords;
    let distance = await useFetch(`/api/request/?x1=${crd.latitude}&y1=${crd.longitude}`);
    results.value = distance.data._rawValue.paths[0].distance;
  }

  request.value = () => { navigator.geolocation.getCurrentPosition(success, error, options); }


</script>
