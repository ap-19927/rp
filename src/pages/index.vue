<script setup>
//https://vue3openlayers.netlify.app/componentsguide/map/#usage
import { ref } from "vue";
import Kompas from "kompas";

const center = ref([40, 40]);
const projection = ref("EPSG:3857");
const zoom = ref(8);
const rotation = ref(0);
const hereIcon = "https://raw.githubusercontent.com/ap-19927/rp/main/map/data/location-heading.svg";

const view = ref(null);
const map = ref(null);
const position = ref([]);

const geoLocChange = (event) => {
  console.log("AAAAA", event);
  position.value = event.target.getPosition();
  view.value?.setCenter(event.target?.getPosition());
  console.log(center.value);
};


const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
const success = (pos) => {
  const crd = pos.coords;
  
  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  const compass = new Kompas();
  compass.watch();
  compass.on('heading', (heading) => {
    style.getImage().setRotation((Math.PI / 180) * heading);
  });
   
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
</script>

<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 800px"
  >
    <ol-view
      ref="view"
      :center="center"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-geolocation :projection="projection" @change:position="geoLocChange">
      <ol-vector-layer :zIndex="2">
        <ol-source-vector>
          <ol-feature ref="positionFeature">
            <ol-geom-point :coordinates="position"></ol-geom-point>
            <ol-style>
              <ol-style-icon :src="hereIcon" :scale="1"></ol-style-icon>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-geolocation>
  </ol-map>
</template>
<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>
