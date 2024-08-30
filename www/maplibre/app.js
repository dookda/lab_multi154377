mapboxgl.accessToken = 'pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNscTM3azN3OTA4dmEyaXF1bmg3cXRvbDUifQ.d1Ovd_n9PwJqc_MdGS66-A';
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

// The following values can be changed to control rotation speed:

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
        // Smoothly animate the map over one second.
        // When this animation is complete, it calls a 'moveend' event.
        map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
}

// Pause spinning on interaction
map.on('mousedown', () => {
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

map.on('load', () => {
    map.addSource('building', {
        'type': 'geojson',
        'data': './usc_hex.geojson'
    });

    // Add a layer to use the 3D extrusion effect
    map.addLayer({
        'id': '3d-buildings',
        'type': 'fill-extrusion',
        'source': 'building',
        'layout': {},
        'paint': {
            'fill-extrusion-color': [
                'step',
                ['get', 'usc_height'], // Property to base the classification on
                '#FFEDA0', // Color for heights less than 20
                200, '#FED976',
                400, '#FEB24C',
                600, '#FD8D3C',
                800, '#E31A1C'
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
});