<template>
  <div id="map-container">
  </div>
  <div>
    <div>facilities: {{ checkedFac }}</div>

    <input type="checkbox" id="waterFountain" value="water fountain" v-model="checkedFac">
    <label for="waterFountain" style="color: rgb(255,0,0)">Water Fountain</label>

    <input type="checkbox" id="restroom" value="restroom" v-model="checkedFac">
    <label for="restroom" style="color: rgb(0,255,0)">Restroom</label>
    <p style="color: rgb(128,0,128)"> Fountain + Restroom </p>
  </div>
</template>

<script setup>
//OpenAI. "Assistance with Interactive Map using OpenLayers and Vue 3 with
//Composition API." ChatGPT. https://openai.com/chatgpt. [Accessed on February
//12, 2024].
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke } from 'ol/style';

const mapElement = ref("map-container");
const formData = ref(null);
const checkedFac = ref([])

onMounted(async () => {
  const drawPlacements = (coordinates, longitude, latitude, facilities) => {
    const marker = new Feature({
      geometry: new Point(coordinates),
    });

    const markerStyleFountain = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 1)',
          width: 2,
        }),
      }),
    });
    const markerStyleRoom = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'rgba(0, 255, 0, 0.5)',
        }),
        stroke: new Stroke({
          color: 'rgba(0, 255, 0, 1)',
          width: 2,
        }),
      }),
    });
    const markerStyleFountainRoom = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'rgba(128, 0, 128, 0.5)',
        }),
        stroke: new Stroke({
          color: 'rgba(128, 0, 128, 1)',
          width: 2,
        }),
      }),
    });
    if(facilities.length === 1 && facilities[0] === "water fountain")
      marker.setStyle(markerStyleFountain);
    else if(facilities.length === 1 && facilities[0] === "restroom")
      marker.setStyle(markerStyleRoom);
    else
      marker.setStyle(markerStyleFountainRoom);

    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });
    map.addLayer(markerLayer);

    // Show marker popup
    const popupContent = `<div>Latitude: ${latitude.toFixed(6)}</div><div>Longitude: ${longitude.toFixed(6)}</div>`;
    overlay.getElement().innerHTML = popupContent;
    overlay.setPosition(coordinates);
  }

  // Function to handle map click event
  const handleMapClick = async (event) => {

    if(checkedFac.value.length === 0) return;

    const coordinates = event.coordinate;
    const [longitude, latitude] = toLonLat(coordinates);
    const currentTime = new Date(Date.now()).toString();
    const facilities = checkedFac.value;
    formData.value = {
      coordinates,
      longitude,
      latitude,
      facilities,
      currentTime,
    };

    await useFetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    drawPlacements(coordinates, longitude, latitude, facilities);
  }

  //Initialize the map
  const map = new Map({
    target: mapElement.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
  // Overlay for displaying marker popup
  const overlay = new Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false,
  });
  map.addOverlay(overlay);

  const inventory = await useFetch("/api/fetchInventory");
  inventory.data._rawValue.inventory.forEach(dataPoint => drawPlacements(dataPoint.coordinates, dataPoint.longitude, dataPoint.latitude, dataPoint.facilities));

  // Event listener for map click
  map.on('click', handleMapClick);
});

</script>

<style scoped>
#map-container {
  width: 100%;
  height: 800px;
}
</style>
