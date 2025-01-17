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
    removalMode: true,
    cutPolygon: false,
    rotateMode: false
})

map.on('pm:create', (e) => {
    let text = e.layer.toGeoJSON();
    let geojson = text.geometry;
    console.log(JSON.stringify(geojson));

    if (geojson.type == 'Point') {
        console.log(JSON.stringify(geojson));
        axios.post('/drawapi/postgeojson', { table: 'survey_point', data: JSON.stringify(geojson) }).then(r => console.log(r));
    } else if (geojson.type == 'LineString') {
        console.log(JSON.stringify(geojson));
        axios.post('/drawapi/postgeojson', { table: 'survey_line', data: JSON.stringify(geojson) }).then(r => console.log(r));
    } else if (geojson.type == 'Polygon') {
        console.log(JSON.stringify(geojson));
        axios.post('/drawapi/postgeojson', { table: 'survey_polygon', data: JSON.stringify(geojson) }).then(r => console.log(r));
    }
});

loadGeojson('survey_point')
loadGeojson('survey_line')
loadGeojson('survey_polygon')

function removeLayer() {
    map.eachLayer((layer) => {
        if (layer.options.name == 'geojson_data') {
            map.removeLayer(layer);
        }
    });
}

function loadGeojson(table) {
    axios.get(`/drawapi/getgeojson/${table}`).then(r => {
        console.log(r.data);
        L.geoJSON(r.data, { name: 'geojson_data' }).addTo(map);
    });
}

map.on('pm:remove', (e) => {
    console.log(e);
    let gid = e.layer.feature.properties.gid;
    let table = e.layer.feature.properties.table;
    console.log(gid, table);
    axios.delete(`/drawapi/deletegeojson/${table}/${gid}`).then(r => {
        console.log(r.data);
    });
});