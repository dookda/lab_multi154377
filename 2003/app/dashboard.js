"use strict"

var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 11
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

getStation()

function getStation() {
    const token = "2b9b7d19f47c41ab2f58a00c0f61315f7a0c5926";
    const latlng = "18.669808,98.902295,18.940375,99.293044";

    let sta = [];
    let pm10 = [];
    let pm25 = [];

    $.get(`https://api.waqi.info/map/bounds/?latlng=${latlng}&token=${token}`).done(async r => {
        r.data.map(i => {
            sta.push(i.uid)
            $.get(`https://api.waqi.info/feed/@${i.uid}/?token=${token}`).done(d => {
                console.log(d)
                let marker = L.marker([i.lat, i.lon], { name: 'marker' });
                marker.addTo(map);
                marker.bindPopup(`ชื่อสถานี: ${d.data.city.name} 
                </br> PM2.5: ${d.data.iaqi.pm25.v}
                </br> PM10: ${d.data.iaqi.pm10.v}`);
                showTable(i.uid, d);

                pm25.push(d.data.iaqi.pm25.v);
                pm10.push(d.data.iaqi.pm10.v);
            })
        })

        setTimeout(() => {
            showChart(sta, pm10, pm25)
        }, 1000);
    })
}

function showTable(uid, d) {
    $("tbody").append(
        `<tr>
                <td>${uid}</td>
                <td>${d.data.iaqi.pm25.v}</td>
            </tr>`
    )
}

function showChart(sta, pm10, pm25) {
    Highcharts.chart('chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'AQI'
        },
        subtitle: {
            text: 'Source: https://aqicn.org/'
        },
        xAxis: {
            categories: sta,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'PM (ไมโครกรัม)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} &#181;</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'PM10',
            data: pm10,
        }, {
            name: 'PM25',
            data: pm25
        }]
    });
}

