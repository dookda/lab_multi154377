mapboxgl.accessToken = 'pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNscTM3azN3OTA4dmEyaXF1bmg3cXRvbDUifQ.d1Ovd_n9PwJqc_MdGS66-A';

let styles = [
    "mapbox://styles/mapbox/standard",
    "mapbox://styles/mapbox/streets-v12",
    "mapbox://styles/mapbox/outdoors-v12",
    "mapbox://styles/mapbox/light-v11",
    "mapbox://styles/mapbox/dark-v11",
    "mapbox://styles/mapbox/satellite-v9",
    "mapbox://styles/mapbox/satellite-streets-v12",
];

const styleSelect = document.getElementById('styleSelect');
styles.forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.text = s;
    styleSelect.appendChild(opt);
});

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    projection: 'globe',
    zoom: 12,
    center: [98.9709308469963, 18.7982209911181],
    pitch: 60, // tilt the map to show 3D
    bearing: -17.6, // set the initial bearing of the map
});

map.addControl(new mapboxgl.NavigationControl());
// map.scrollZoom.disable();

map.on('style.load', () => {
    map.setFog({});
    loadJson();
    loadWms();
});

styleSelect.addEventListener('change', (e) => {
    map.setStyle(e.target.value);
});

function loadJson() {
    // Check if the source already exists to avoid errors
    if (map.getSource('building')) {
        map.removeLayer('3d-buildings');
        map.removeSource('building');
    }

    map.addSource('building', {
        'type': 'geojson',
        'data': './usc_hex.geojson'
    });

    map.addLayer({
        'id': '3d-buildings',
        'type': 'fill-extrusion',
        'source': 'building',
        'layout': {},
        'paint': {
            'fill-extrusion-color': [
                'step',
                ['get', 'usc_height'],
                '#FFEDA0',
                20, '#FED976',
                50, '#FEB24C',
                100, '#FD8D3C',
                150, '#E31A1C'
            ],
            'fill-extrusion-opacity': [
                'case',
                ['<', ['get', 'usc_height'], 600], 0,
                0.6
            ],
            'fill-extrusion-height': ['get', 'usc_height'],
            'fill-extrusion-opacity': 0.6
        }
    });
}

function loadWms() {
    map.addSource('wms-source', {
        'type': 'raster',
        'tiles': [
            'https://engrids.soc.cmu.ac.th/geoserver/CM/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=CM%3Acontour'
        ],
        'tileSize': 256
    });

    // Add WMS layer
    map.addLayer({
        'id': 'wms-layer',
        'type': 'raster',
        'source': 'wms-source',
        'paint': {}
    });
};

