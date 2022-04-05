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
    src: './data/location-heading.svg',
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
    center: fromLonLat([-122, 37]),
    zoom: 14,
  }),
});
map.addLayer(layer);

const success = async (jd) => {
  $("#load").empty();
  $('#stage').append('<p> From: ' +y1+','+x1+'</p>');
  $('#stage').append('<p> To: ' +y2+','+x2+'</p>');
  $('#stage').append('<p> -----------</p>');
  let instr = await jd.paths[0].instructions
  for(let i =0;i<instr.length;i++) {
   $('#stage').append('<p>' + instr[i].text+ '</p>');
   $('#stage').append('<p>In: ' + instr[i].distance+ 'm</p>');
  }
  const polyline = await jd.paths[0].points; //https://stackoverflow.com/questions/68126956/use-openlayers-for-draw-route-from-graphhpper
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
  ajaxLoading = false;
}

let m=0;
let x1;
let y1;
let x2;
let y2;
let url;
let ajaxLoading = false; //https://electrictoolbox.com/jquery-prevent-ajax-request-firing-twice/
const floor = (x) => {
  const t = 100000000;
  return Math.floor(x*t)/t;
}
const from = document.getElementById('popup-from');
const to = document.getElementById('popup-to');
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
    $("#load").empty();
    x1=floor(coordinate[0]);
    y1=floor(coordinate[1]);
    if(map.getLayers().array_.length > 2) map.removeLayer(map.getLayers().array_[map.getLayers().array_.length-1])
    from.innerHTML = '<p>Directions from:</p><code>' + y1+','+x1 + '</code>';
  }
  if(m==2){
    x2=floor(coordinate[0]);
    y2=floor(coordinate[1]);
    to.innerHTML = '<p>To:</p><code>' + y2+','+x2 + '</code>';
    load.innerHTML = '<input type = "button" id = "driver" value = "Load Data" />';
    url = 'https://graphhopper.com/api/1/route?point='+y1+','+x1+'&point='+y2+','+x2+'&profile=car&key='+key
    $("#driver").click(function(event){
      if(!ajaxLoading) {
        ajaxLoading = true;
        fetch(url).then(res => {return res.json()}).then(success)
      }
    });
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
    alert(`ERROR: ${error.message}`);
  },
  {
    enableHighAccuracy: true,
  }
);
const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">◎</button>';
locate.addEventListener('click', function () {
  if (!source.isEmpty()) {
    map.getView().fit(source.getExtent(), {
      maxZoom: 18,
      duration: 500,
    });
  }
});
map.addControl(
  new Control({
    element: locate,
  })
);
if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
  locate.addEventListener('click', function () {
    DeviceOrientationEvent.requestPermission()
      .then(function () {
        const compass = new Kompas();
        compass.watch();
        compass.on('heading', function (heading) {
          style.getImage().setRotation((Math.PI / 180) * heading);
        });
      })
      .catch(function (error) {
        alert(`ERROR: ${error.message}`);
      });
  });
}
