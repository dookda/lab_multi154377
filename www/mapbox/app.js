mapboxgl.accessToken = 'pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNscTM3azN3OTA4dmEyaXF1bmg3cXRvbDUifQ.d1Ovd_n9PwJqc_MdGS66-A';

let style = ["mapbox://styles/mapbox/standard",
    "mapbox://styles/mapbox/streets-v12",
    "mapbox://styles/mapbox/outdoors-v12",
    "mapbox://styles/mapbox/light-v11",
    "mapbox://styles/mapbox/dark-v11",
    "mapbox://styles/mapbox/satellite-v9",
    "mapbox://styles/mapbox/satellite-streets-v12",
    "mapbox://styles/mapbox/navigation-day-v1",
    "mapbox://styles/mapbox/navigation-night-v1",
]

const styleSelect = document.getElementById('styleSelect');
style.forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.text = s;
    styleSelect.appendChild(opt);
})

styleSelect.addEventListener('change', (e) => {
    map.setStyle(e.target.value);

    // destroy befor add new source
    // map.removeSource('building');
    // map.removeLayer('3d-buildings');
    // loadJson();

    // reload source    
    map.getSource('building').setData('./usc_hex.geojson');
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
            // 'fill-extrusion-base': ['get', 80],
            'fill-extrusion-opacity': 0.6
        }
    });
})

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    projection: 'globe',
    zoom: 12,
    center: [98.9709308469963, 18.7982209911181],
    pitch: 60, // tilt the map to show 3D
    bearing: -17.6 //
});

map.addControl(new mapboxgl.NavigationControl());
// map.scrollZoom.disable();

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

// At low zooms, complete a revolution every two minutes.
const secondsPerRevolution = 240;
// Above zoom level 5, do not rotate.
const maxSpinZoom = 5;
// Rotate at intermediate speeds between zoom levels 3 and 5.
const slowSpinZoom = 3;

let userInteracting = false;
const spinEnabled = true;

function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
            // Slow spinning at higher zooms
            const zoomDif =
                (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
}

// Pause spinning on interaction
map.on('mousedown', (e) => {
    console.log(e);
    userInteracting = true;
});
map.on('dragstart', () => {
    userInteracting = true;
});

// When animation is complete, start spinning if there is no ongoing interaction
map.on('moveend', () => {
    spinGlobe();
});

spinGlobe();

// map.on('load', () => {
map.on('load', () => {
    loadJson();
});

const loadJson = () => {
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
            // 'fill-extrusion-base': ['get', 80],
            'fill-extrusion-opacity': 0.6
        }
    });
};