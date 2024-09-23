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

create database
```sql
CREATE TABLE survey_point (
    gid serial not null,
    pname text,
    pdesc text,
    geom geometry(point, 4326)
)

CREATE TABLE survey_line (
    gid serial not null,
    pname text,
    pdesc text,
    geom geometry(point, 4326)
)

CREATE TABLE survey_polygon (
    gid serial not null,
    pname text,
    pdesc text,
    geom geometry(point, 4326)
)
```

api
```js
app.post('/drawapi/postgeojson', (req, res) => {
    const { data } = req.body
    let sql = `INSERT INTO survey_point(pname, geom)VALUES(
                'test2', ST_GeomFromGeoJSON('${data}')
            )`
    db.query(sql).then(res.json({ status: "success" }))
})

app.get('/drawapi/getdata', (req, res) => {
    let sql = `SELECT pname, ST_AsGeoJSON(geom) as geom FROM survey_point`;
    db.query(sql).then(r => {
        res.json({ data: r.rows })
    })
})

```

app.js
```js
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
```