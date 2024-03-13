<template>
<div>
  <div v-if="isLoading">Loading ...</div>
  <div v-else>
    <pre v-if="isAuthenticated">
      <div>
        <h2>Request Driver</h2>
        <form>
          <input v-model="source" placeholder="source address">
          <label for="checkbox"> Or use location:</label>
          <input type="checkbox" id="checkbox" v-model="useLocation">
          <input v-model="destination" placeholder="destination address">
        </form>
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

const source = ref(null);
const useLocation = ref(null);
const destination = ref(null);
const request = ref(null);
const results = ref(null);

const tripDriverData = async (start) => {
  const destGeocode = await useFetch(`/api/geocode/?text=${destination.value}`);
  const dest = destGeocode.data._rawValue.features[0].geometry.coordinates;
  const distance = await useFetch(`/api/request/?x1=${start[1]}&y1=${start[0]}&x2=${dest[1]}&y2=${dest[0]}`);

  results.value = [];
  results.value.push(`distance to driver: ${distance.data._rawValue[0].paths[0].distance}`);
  results.value.push(`distance of trip: ${distance.data._rawValue[1].paths[0].distance}`);
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
const error = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
const locSuccess = (pos) => {
  const loc = [pos.coords.longitude, pos.coords.latitude];
  tripDriverData(loc);
}

const newSuccess = async () => {
  const locGeocode = await useFetch(`/api/geocode/?text=${source.value}`);
  const loc = locGeocode.data._rawValue.features[0].geometry.coordinates;
  await tripDriverData(loc);
}

request.value = () => {
  if(useLocation.value) navigator.geolocation.getCurrentPosition(locSuccess, error, options);
  else newSuccess();
}
</script>
