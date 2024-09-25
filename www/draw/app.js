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
    drawCircleMarker: false,
    drawCircle: false,
    drawRectangle: false,
    drawText: false,
    dragMode: false,
    editMode: false,
    removalMode: false,
    cutPolygon: false,
    rotateMode: false
})

map.on('pm:create', (e) => {
    let text = e.layer.toGeoJSON();
    let geojson = text.geometry;
    console.log(geojson);

    if (geojson.type == 'Polygon') {
        axios.post('/drawapi/postgeojson', { table: 'survey_polygon', data: geojson }).then(r => console.log(r));
    } else if (geojson.type == 'LineString') {
        axios.post('/drawapi/postgeojson', { table: 'survey_line', data: geojson }).then(r => console.log(r));
    } else if (geojson.type == 'Point') {
        axios.post('/drawapi/postgeojson', { table: 'survey_point', data: geojson }).then(r => console.log(r));
    }
    // axios.post('/drawapi/postgeojson', { table: , data: geojson }).then(r => console.log(r));
});