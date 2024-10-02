# lab_multi154377

## lab 13 การหาตำแหน่ง

0. add map locate
```js
map.locate({ setView: true, maxZoom: 18 })
```

1. create onLocationFound function
```js
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
```

2. call function
```js
map.on("locationfound", onLocationFound)
map.on("locationerror", onLocationError)

```

## lab 14 การนำทาง

0. copy from "13 geolocation lab"
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
```

1. create google map route function
```js
function gotoGoogle(){
    console.log(start, end);
    window.open(`https://www.google.co.th/maps/dir/${start.lat},${start.lng}/${end.lat},${end.lng}`, "_blank")
}
```

2. map on click event
```js
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
```

## lab15 การวิเคราะห์ข้อมูลบนเว็บแผนที่
0. copy "geolocation lab" & install libraries
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

1. test ST_DWithin()
```sql
SELECT h.*, ST_X(h.geom) as lng, ST_Y(h.geom) as lat
FROM cm_hospital_4326 h
WHERE ST_DWithin(
        ST_Transform(h.geom, 32647),
        ST_Transform(ST_GeomFromText('POINT(99.00149987736573 18.88616849231567)',4326),32647),
    15000) = true
```

2. create API
```js
app.get('/getdwithin/:lat/:lng/:radius', (req, res) => {
    const { lat, lng, radius } = req.params;
    console.log(lat, lng);
    let sql = `SELECT h.*, ST_AsGeoJSON(h.geom) as json, ST_X(h.geom) as lng, ST_Y(h.geom) as lat
                FROM cm_hospital_4326 h
                WHERE ST_DWithin(
                    ST_Transform(h.geom, 32647),
                    ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})', 4326),32647),
                ${radius}) = true`;
    db.query(sql).then(r => {
        res.json(r.rows)
    })
})
```

3. on click event
```js
map.on('click', (e) => {
    let myIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/9131/9131546.png',
        iconSize: [36, 36],
        iconAnchor: [13, 32],
        popupAnchor: [7, -25]
    })

    L.marker(e.latlng, { icon: myIcon, name: "hp" }).addTo(map)
    axios.get(`/getdwithin/${e.latlng.lat}/${e.latlng.lng}/5000`)
        .then((res) => {
            console.log(res);
        });
})
```

4. add marker
```js
res.data.forEach(i => {
    L.geoJSON(JSON.parse(i.json), { name: "hp" })
        .addTo(map)
        .bindPopup(i.name);
})
```

5. add circle
```js
L.circle(e.latlng, { radius: 1000, name: "hp" }).addTo(map);
```

6. remove layer function
```js
function removeLayer() {
    map.eachLayer((layer) => {
        if (layer.options.name == 'hp') {
            map.removeLayer(layer);
        }
    });
}
```

7. add Turf.js
```html
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"></script>
```

8.  nearestPoint function  https://turfjs.org/docs/api/nearestPoint
```js
const points = res.data.map(i => turf.point([i.lng, i.lat]));
const targetPoint = turf.point([e.latlng.lng, e.latlng.lat]);
var nearest = turf.nearestPoint(targetPoint, turf.featureCollection(points));
L.geoJSON(nearest.geometry, { name: "hp" })
    .addTo(map)
    .bindPopup('ใกล้ที่สุด').openPopup();

```

## lab 16 การเขียนเว็บแผนที่และกระดานสรุป
0. copy "geolocation lab" & install libraries
```html
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

1. layout
```html
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-8">
                <div class="card">
                    <div class="card-body" id="map"></div>
                </div>
            </div>
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <label for="">น้ำล้นตลิ่ง</label>
                        <div id="list">
                            <ul id="ul"></ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div id="chart"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
```

2. add style
```css
#map {
    width: 100%;
    height: 560px;
}

#list {
    width: 100%;
    height: 500px;
    overflow-y: auto;
}

.cursor {
    cursor: pointer;
}
```

3. water level API
```js
axios.get("http://api2.thaiwater.net:9200/api/v1/thaiwater30/provinces/waterlevel").then(r => {
    r.data.data.forEach(item => {
        console.log(item);
        let latlng = { lat: item.station.tele_station_lat, lng: item.station.tele_station_long }
        L.marker(latlng).addTo(map).bindPopup(`${item.station.tele_station_name.th}<br>${item.waterlevel_msl} mm.<br>${item.diff_wl_bank_text}`)
    })
});
```

4. custom marker
```js
let greenIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png',
    iconSize: [36, 36],
    iconAnchor: [13, 32],
    popupAnchor: [7, -25]
})
let redIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/14090/14090313.png',
    iconSize: [36, 36],
    iconAnchor: [13, 32],
    popupAnchor: [7, -25]
})
```

5. apply marker
```js
{ icon: item.diff_wl_bank_text == 'ล้นตลิ่ง (ม.)' ? redIcon : greenIcon }
```

6. filter
```js
let critical = r.data.data.filter(item => item.diff_wl_bank_text == 'ล้นตลิ่ง (ม.)')
```

7. create showList function
```js
function showList(item) {
    let list = document.getElementById("ul")
    console.log(item);
    item.forEach(i => {
        list.innerHTML += `<li class="cursor"><span class="badge text-bg-warning">${i.station.tele_station_name.th} ${i.waterlevel_msl} mm.</span></li>`
    })
}
```

8. add setView
```js
function setView(lat, lng) {
    map.setView([Number(lat), Number(lng)], 15)
}
```

```js
list.innerHTML += `<li class="cursor" onclick="setView(${i.station.tele_station_lat},${i.station.tele_station_long})"><span class="badge text-bg-warning cursor">${i.station.tele_station_name.th} ${i.waterlevel_msl} mm.</span></li>`
```

9. create showChart function
```js
function showChart(item) {
    var options = {
        series: [{
            name: 'การกักเก็บ (%)',
            data: item.map(i => Number(i.storage_percent))
        }],
        chart: {
            height: 450,
            type: 'bar',
            zoom: {
                enabled: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'การกักเก็บ (%)',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: item.map(i => i.station.tele_station_name.th),
        }
    };
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}
```

## lab 17 การสร้างและแก้ไขข้อมูล Geometry
0. copy "geolocation lab" & install libraries
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

