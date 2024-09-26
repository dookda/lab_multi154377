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

map.locate({ setView: true, maxZoom: 18 })

function onLocationFound(e) {
    console.log(e);
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

function showList(item) {
    let list = document.getElementById("ul")
    console.log(item);
    item.forEach(i => {
        list.innerHTML += `<li class="badge text-bg-warning">${i.station.tele_station_name.th} ${i.waterlevel_msl} mm.</li>`
    })
}

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

axios.get("http://api2.thaiwater.net:9200/api/v1/thaiwater30/provinces/waterlevel").then(r => {
    let critical = r.data.data.filter(item => item.diff_wl_bank_text == 'ล้นตลิ่ง (ม.)')
    showList(critical);
    showChart(critical);
    r.data.data.forEach(item => {
        let latlng = { lat: item.station.tele_station_lat, lng: item.station.tele_station_long }
        L.marker(latlng, { icon: item.diff_wl_bank_text == 'ล้นตลิ่ง (ม.)' ? redIcon : greenIcon }).addTo(map).bindPopup(`${item.station.tele_station_name.th}<br>${item.waterlevel_msl} mm.<br>${item.diff_wl_bank_text}`)
    })
});


