import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Map, NavigationControl, Marker, Popup } from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import "./style.css";

const map = new Map({
    container: 'map',
    style: {
        version: 8,
        projection: { type: 'globe' },
        sources: {},
        layers: []
    },
    center: [98.81, 18.69],
    zoom: 7
});

const basemaps = [
    {
        name: "osm",
        label: 'OpenStreetMap',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    {
        name: "satellite",
        label: 'Satellite (Esri)',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        attribution: 'Esri, Maxar, Earthstar Geographics'
    }
];

const select = document.getElementById('basemap');

function setBasemap(active) {
    for (const i in basemaps) {
        map.setLayoutProperty(basemaps[i].name, 'visibility', basemaps[i].name === active ? 'visible' : 'none');
    }
}

map.on('load', () => {
    for (const i in basemaps) {
        map.addSource(basemaps[i].name, {
            type: 'raster',
            tiles: basemaps[i].tiles,
            tileSize: 256,
            attribution: basemaps[i].attribution
        });

        map.addLayer({
            id: basemaps[i].name,
            type: 'raster',
            source: basemaps[i].name,
            layout: { visibility: 'none' }
        });
    }

    // show whichever option the <select> currently has
    setBasemap(select.value);
});

select.addEventListener('change', (e) => setBasemap(e.target.value));

// add navigation control
let nav = new NavigationControl();
map.addControl(nav, 'top-left');

// 5. การเพิ่ม feature (Marker)
const popup = new Popup({ closeOnClick: true })
    .setHTML('<p>98.91, 18.69</p>');

new Marker()
    .setLngLat([98.91, 18.69])
    .setPopup(popup)
    .addTo(map)
    .togglePopup();

// เพิ่ม event on click เพื่อดูพิกัด
map.on('click', (e) => {
    console.log(`Map clicked at ${e.lngLat.lat}, ${e.lngLat.lng}`);
});



// 1. ตัวแปรเก็บข้อมูลพิกัด GeoJSON
const myGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [98.9565718, 18.7960669]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [98.9676835, 18.8014209],
                    [98.9693469, 18.805074],
                    [98.9741376, 18.8090421],
                    [98.9834527, 18.8116244]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [98.97839590939122, 18.795688994901013],
                        [98.99290093776801, 18.795688994901013],
                        [98.99290093776801, 18.78138996389822],
                        [98.97839590939122, 18.78138996389822],
                        [98.97839590939122, 18.795688994901013]
                    ]
                ]
            }
        }
    ]
};

// 2. เพิ่มชั้นข้อมูลแบบ Point, Line และ Polygon ลงบนแผนที่
map.on('load', () => {
    // Point
    map.addSource('myGeoJSONPoint', {
        type: 'geojson',
        data: myGeoJSON.features[0]
    });
    map.addLayer({
        id: 'myGeoJSONPoint',
        type: 'circle',
        source: 'myGeoJSONPoint',
        paint: {
            'circle-radius': 6,
            'circle-color': '#B42222'
        }
    });

    // Line
    map.addSource('myGeoJSONLine', {
        type: 'geojson',
        data: myGeoJSON.features[1]
    });
    map.addLayer({
        id: 'myGeoJSONLine',
        type: 'line',
        source: 'myGeoJSONLine',
        paint: {
            'line-width': 4,
            'line-color': '#0000FF'
        }
    });

    // Polygon
    map.addSource('myGeoJSONPolygon', {
        type: 'geojson',
        data: myGeoJSON.features[2]
    });
    map.addLayer({
        id: 'myGeoJSONPolygon',
        type: 'fill',
        source: 'myGeoJSONPolygon',
        paint: {
            'fill-color': '#00FF00',
            'fill-opacity': 0.5
        }
    });
    map.addLayer({
        id: 'myGeoJSONPolygonBorder',
        type: 'line',
        source: 'myGeoJSONPolygon',
        paint: {
            'line-width': 3,
            'line-color': '#006600'
        }
    });
});

// 3. เพิ่มการตอบสนองเมื่อคลิกที่ Feature (Popup)
const featurePopup = new Popup({ closeOnClick: false });
function showPopup(e, label) {
    const feature = e.features[0];
    const at = feature.geometry.type === 'Point' ? feature.geometry.coordinates : e.lngLat;
    featurePopup
        .setLngLat(at)
        .setHTML(`<strong>${label}</strong><br>${e.lngLat.lat.toFixed(5)}, ${e.lngLat.lng.toFixed(5)}`)
        .addTo(map);
}

map.on('click', 'myGeoJSONPolygon', (e) => showPopup(e, 'Polygon'));
map.on('click', 'myGeoJSONLine', (e) => showPopup(e, 'Line'));
map.on('click', 'myGeoJSONPoint', (e) => showPopup(e, 'Point'));