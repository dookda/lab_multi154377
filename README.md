# lab_multi154377

### lab 13
```js
map.locate({ setView: true, maxZoom: 18 })

function onLocationFound(e) {
    console.log(e.accuracy);
    var gps = L.marker(e.latlng, { draggable: true });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();

    var circle = L.circle(e.latlng, { radius: e.accuracy });
    circle.addTo(map)
    start = e.latlng;
}

function onLocationError(e) {
    console.log(e)
}

map.on("locationfound", onLocationFound)
map.on("locationerror", onLocationError)

```

### lab 14
```js
map.locate({ setView: true, maxZoom: 18 })
var start = null;
var end = null;
function onLocationFound(e) {
    console.log(e.accuracy);
    var gps = L.marker(e.latlng, { draggable: true });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();

    var circle = L.circle(e.latlng, { radius: e.accuracy });
    circle.addTo(map)
    start = e.latlng;
}

function onLocationError(e) {
    console.log(e)
}

map.on("locationfound", onLocationFound)
map.on("locationerror", onLocationError)

map.on("click", function (e) {
    map.eachLayer(function (layer) {
        if (layer.options.name == 'marker') {
            map.removeLayer(layer);
        }
    })
    // console.log(e.latlng);
    end = e.latlng;
    L.marker(e.latlng, { name: 'marker' }).addTo(map).bindPopup(`<button class="btn btn-success" onclick="gotoGoogle()">ok</button>`).openPopup();
})

const gotoGoogle = () => {
    console.log(start, end);
    window.open(`https://www.google.co.th/maps/dir/${start.lat},${start.lng}/${end.lat},${end.lng}`, "_blank")
}
```

### lab 17
0. install libraries
```html
<link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css" />


<script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

1.create database
```sql
CREATE TABLE survey_point (
    gid serial NOT NULL,
    pname text,
    pdesc text,
    geom geometry(Point, 4326)
);

CREATE TABLE survey_line (
    gid serial NOT NULL,
    pname text,
    pdesc text,
    geom geometry(LineString, 4326)
);

CREATE TABLE survey_polygon (
    gid serial NOT NULL,
    pname text,
    pdesc text,
    geom geometry(Polygon, 4326)
);
```

2. create API
```js
app.post('/drawapi/postgeojson', (req, res) => {
    const { table, data } = req.body
    let sql = `INSERT INTO ${table}(pname, geom)VALUES(
                'test2', ST_GeomFromGeoJSON('${data}'))`;
    console.log(sql);

    db.query(sql).then(r => {
        res.json({ status: "success" })
    })
})

app.get('/drawapi/getgeojson/:table', (req, res) => {
    const { table } = req.params
    let sql = `SELECT gid, pname, ST_AsGeoJSON(geom) as geom FROM ${table}`;
    db.query(sql).then(r => {
        const features = r.rows.map(row => ({
            type: 'Feature',
            id: row.gid,
            properties: {
                gid: row.gid,
                table: table,
            },
            geometry: JSON.parse(row.geom)
        }));

        const geojson = {
            type: 'FeatureCollection',
            features: features
        };

        res.json(geojson);
    }).catch(error => {
        res.status(500).send(error.message);
    });
})

app.delete('/drawapi/deletegeojson/:table/:gid', (req, res) => {
    const { table, gid } = req.params
    let sql = `DELETE FROM ${table} WHERE gid = ${gid}`;
    console.log(sql);

    db.query(sql).then(r => {
        res.json({ status: "deleted" })
    })
})

```

3. create control & send geometry to database
```js
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
```

4. load data to map
```js
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
```

5. remove layer
```js
map.on('pm:remove', (e) => {
    console.log(e);
    let gid = e.layer.feature.properties.gid;
    let table = e.layer.feature.properties.table;
    console.log(gid, table);
    axios.delete(`/drawapi/deletegeojson/${table}/${gid}`).then(r => {
        console.log(r.data);
    });
});
```