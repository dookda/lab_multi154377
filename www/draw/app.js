var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 15
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {});

var province = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/th/wms?", {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true
})

var basemap = {
    "osm": osm.addTo(map)
}
var overmap = {
    "จังหวัด": province.addTo(map)
}

L.control.layers(basemap, overmap).addTo(map);



map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
    drawCircleMarker: false
});

map.on('pm:create', (e) => {
    let text = e.layer.toGeoJSON();
    let geojson = JSON.stringify(text.geometry);
    console.log(geojson);
    axios.post('/drawapi/postgeojson', { data: geojson }).then(r => console.log(r));
});