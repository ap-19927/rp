<template>
  <div id="map-container">
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

onMounted(() => {
  // Function to handle map click event
  const handleMapClick = (event) => {
    const coordinates = event.coordinate;
    const [longitude, latitude] = toLonLat(coordinates);
    const marker = new Feature({
      geometry: new Point(coordinates),
    });

    const markerStyle = new Style({
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
    marker.setStyle(markerStyle);

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
