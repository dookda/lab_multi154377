"use strict"

var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 15
})

// basemap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

// overlay 
var province = L.tileLayer.wms('https://rti2dss.com:8443/geoserver/th/wms?', {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true
})

var baseMap = {
    "OpenStreetMap": osm.addTo(map),
    "Esri WorldStreetMap": Esri_WorldStreetMap
}

var overlayMap = {
    "province": province.addTo(map)
}

L.control.layers(baseMap, overlayMap).addTo(map)

map.pm.addControls({
    position: 'topleft',
    drawCircleMarker: false,
    drawPolyline: false,
    drawRectangle: false,
    drawCircle: false,
    editMode: false,
    dragMode: false,
    cutPolygon: false,
    removalMode: false
})

map.on('pm:create', e => {
    findRoad(e)
});

function findRoad(e) {
    // console.log(JSON.stringify(e.layer.toGeoJSON().geometry))
    let data = {
        geom: e.layer.toGeoJSON().geometry
    };
    $.post("http://localhost:3000/api/findroad", data).done(r => {
        // console.log(r)
        var latlngs = [
            [45.51, -122.68],
            [37.77, -122.43],
            [34.04, -118.2]
        ];
        var polyline;
        r.data.map(i => {
            var f = JSON.parse(i.geomtext)
            console.log(f.coordinates)
            polyline = L.polyline(f.coordinates, { color: 'red' });
            polyline.addTo(map);
        })

    })
}

function findHospital() {
    rmLyr()
    console.log(e)
    e.layer.options.name = 'marker';
    let data = {
        geom: e.layer.toGeoJSON().geometry
    };
    const icon = L.icon({
        iconUrl: "https://www.flaticon.com/svg/static/icons/svg/1946/1946401.svg",
        iconSize: [32, 32],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    $.post("http://localhost:3000/api/findhospital", data).done(r => {
        r.data.map(i => {
            console.log(i)
            var marker = L.marker([i.lat, i.lng], {
                icon: icon,
                name: 'marker'
            })
            marker.addTo(map)
            marker.bindPopup('ชื่อ รพ.: ' + i.name)
        })
    })
}


function rmLyr() {
    map.eachLayer(lyr => {
        if (lyr.options.name == 'marker') {
            map.removeLayer(lyr)
        }
    })
}