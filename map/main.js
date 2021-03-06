import './style.css';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import {toLonLat} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Polyline from 'ol/format/Polyline';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {circular} from 'ol/geom/Polygon';
import Control from 'ol/control/Control';
import {
  Fill,
  Icon,
  Stroke,
  Style,
} from 'ol/style';
import Kompas from 'kompas';
import locationHeading from './data/location-heading.svg'
const container = document.getElementById('popup');//https://openlayers.org/en/latest/examples/popup.html
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});
const style = new Style({
  fill: new Fill({
    color: 'rgba(0, 0, 255, 0.2)',
  }),
  image: new Icon({
    src: locationHeading,
    imgSize: [27, 55],
    rotateWithView: true,
  }),
});
const source = new VectorSource();
const layer = new VectorLayer({
  source: source,
});
layer.setStyle(style);
const map = new Map({
  overlays: [overlay],
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([-122.09494205,37.0586273]),
    zoom: 18,
  }),
});
map.addLayer(layer);

const success = (jd) => {
  overlay.setPosition(undefined);
  $('#stage').append(`<p>From:</p><code>${y1},${x1}</code>`);
  $('#stage').append(`<p>To:</p><code>${y2},${x2}</code>`);
  $('#stage').append(`<p>On:<code>${$('#mode option:selected').val()}</code></p>`);
  $('#stage').append('<p> -----------</p>');
  let instr = jd.paths[0].instructions
  for(let i =0;i<instr.length;i++) {
   $('#stage').append('<p>' + instr[i].text+ '</p>');
   $('#stage').append('<p>In: ' + instr[i].distance+ 'm</p>');
  }
  const polyline = jd.paths[0].points; //https://stackoverflow.com/questions/68126956/use-openlayers-for-draw-route-from-graphhpper
  const route = new Polyline().readGeometry(polyline, {
      featureProjection: 'EPSG:3857',
    });
  const routeFeature = new Feature({
   type: 'route',
   geometry: route,
  });
  const styles = {
   'route': new Style({
     stroke: new Stroke({
       width: 6,
       color: [0, 0, 0, 0.8],
     }),
   }),
  };
  const vectorLayer = new VectorLayer({
   source: new VectorSource({
     features: [routeFeature],
   }),
   style: styles.route
  });
  map.addLayer(vectorLayer);
}

let m=0;
let x1;
let y1;
let x2;
let y2;
let url;
const profile = '<label for="mode">Choose a mode:</label> <select name="mode" id="mode"> <option value="foot">foot</option> <option value="bike">bike</option> <option value="car">car</option>'
const floor = (x) => {
  const t = 100000000;
  return Math.floor(x*t)/t;
}
const from = document.getElementById('popup-from');
const to = document.getElementById('popup-to');
const mode = document.getElementById("mode");
const load = document.getElementById('load');
const closer = document.getElementById('popup-closer');
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
const click = function (evt) {
  $("#stage").empty();
  const coordinate = toLonLat(evt.coordinate);
  overlay.setPosition(evt.coordinate);
  m+=1;
  if(m==1){
    $("#popup-from").empty();
    $("#popup-to").empty();
    $("#mode").empty();
    $("#load").empty();
    x1=floor(coordinate[0]);
    y1=floor(coordinate[1]);
    if(map.getLayers().array_.length > 2) map.removeLayer(map.getLayers().array_[map.getLayers().array_.length-1])
    from.innerHTML = `<p>From:</p><code>${y1},${x1}</code>`;
  }
  if(m==2){
    x2=floor(coordinate[0]);
    y2=floor(coordinate[1]);
    to.innerHTML = `<p>To:</p><code>${y2},${x2}</code>`;
    load.innerHTML = '<input type = "button" id = "driver" value = "get directions" />';
    mode.innerHTML = profile;
    const postApi = () => { $.ajax({
      url: 'https://roadpeoples.com/api',
      //url: 'http://localhost:3000/api',
      data: JSON.stringify({x1:x1,y1:y1,x2:x2,y2:y2,profile:$('#mode option:selected').val(),}),
      type: 'POST',
      success: success,
      error: (e) => {console.log('Error: ' + e.message);},
    })};
    $("#driver").on('click',postApi);

  }
  m%=2;
};
map.on('click', click);

navigator.geolocation.watchPosition( //https://openlayers.org/workshop/en/mobile/
  function (pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = circular(coords, pos.coords.accuracy);
    source.clear(true);
    source.addFeatures([
      new Feature(
        accuracy.transform('EPSG:4326', map.getView().getProjection())
      ),
      new Feature(new Point(fromLonLat(coords))),
    ]);
  },
  function (error) {
    console.log(`ERROR: ${error.message}`);
  },
  {
    enableHighAccuracy: true,
  }
);
const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">???</button>';
const getFindMe = function () {
  if (!source.isEmpty()) {
    map.getView().fit(source.getExtent(), {
      maxZoom: 18,
      duration: 500,
    });
  }
}
//https://stackoverflow.com/questions/44989705/combining-click-and-touchstart-events-not-working
if ('ontouchstart' in window) {
  locate.addEventListener('touchstart', getFindMe);
}
else locate.addEventListener('click', getFindMe);
map.addControl(
  new Control({
    element: locate,
  })
);
if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
  const getHeading = function () {
    DeviceOrientationEvent.requestPermission()
      .then(function () {
        const compass = new Kompas();
        compass.watch();
        compass.on('heading', function (heading) {
          style.getImage().setRotation((Math.PI / 180) * heading);
        });
      })
      .catch(function (error) {
        console.log(`ERROR: ${error.message}`);
      });
  }
  if ('ontouchstart' in window) {
    locate.addEventListener('touchstart', getHeading);
  }
  else locate.addEventListener('click', getHeading);
}
