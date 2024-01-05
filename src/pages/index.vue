<script setup>
//https://vue3openlayers.netlify.app/componentsguide/map/#usage
import { ref } from "vue";
import Kompas from "kompas";

const center = ref([-117,33]);
const projection = ref("EPSG:4326");
const zoom = ref(9);
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
const count = ref(0)

const y1 = 33.47
const y2 = 33 
const x1 = -117
const x2 = -117.0911645
const key = "d226e6ab-bff6-4e39-a97a-3ee7c3259710"
const ghURL = `https://graphhopper.com/api/1/route?point=${y1},${x1}&point=${y2},${x2}&points_encoded=false&key=${key}`
let polyline = await useFetch(ghURL)
polyline = polyline.data._rawValue.paths[0].points.coordinates;
const coordinates = ref(polyline);
console.log("POINTS:",polyline)
const strokeWidth = ref(6);
const strokeColor = ref([0,0,0,0.8]);

const selectConditions = inject("ol-selectconditions");

const selectCondition = selectConditions.click;

const m = 0;
const featureSelected = (event) => {
  console.log("FEATURE:",event);
/*
  const coordinate = toLonLat(evt.coordinate);
  m+=1;
  if(m==1){
    x1=floor(coordinate[0]);
    y1=floor(coordinate[1]);
  }
  if(m==2){
    x2=floor(coordinate[0]);
    y2=floor(coordinate[1]);
  }
  m%=2;
*/
};

const selectInteactionFilter = (feature) => {
  return feature.values_.name != undefined;
};
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
      @select="featureSelected"
    />
    <ol-tile-layer
      @select="featureSelected">
      <ol-source-osm />
    </ol-tile-layer>


    <ol-interaction-select
      :condition="selectCondition"
      :filter="selectInteactionFilter"
    >
    </ol-interaction-select>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature>
          <ol-geom-line-string :coordinates="coordinates"></ol-geom-line-string>
          <ol-style>
            <ol-style-stroke
              :color="strokeColor"
              :width="strokeWidth"
            ></ol-style-stroke>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

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
