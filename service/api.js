const express = require('express');
const app = express.Router();
const axios = require('axios');
const con = require("./db");

let houses = [
    { id: 1, address: '123 Main St', owner: 'John Doe' },
    { id: 2, address: '456 Maple Ave', owner: 'Jane Smith' },
];

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// GET all houses
app.get('/api/house', (req, res) => {
    res.json(houses);
});



app.get('/api/getdata', function (req, res) {
    res.json({
        status: "ok"
    })
})

app.get('/api/getpoint', function (req, res) {
    let sql = `SELECT *, ST_X(geom) as lng, ST_Y(geom) as lat FROM survey`
    db.query(sql).then(r => {
        // console.log(r.rows)
        res.json({
            status: 'get data',
            data: r.rows
        })
    })
})

app.get('/api/addpoint/:lat/:lng', function (req, res) {
    let { lat, lng } = req.params

    let sql = `INSERT INTO survey (pname, pdesc, geom)VALUES(
        'test pname', 'test pdesc', 
        ST_GeomFromText('POINT(${lng} ${lat})', 4326))`

    db.query(sql).then(r => {
        res.json({
            status: "insert done"
        })
    })
})

app.post('/api/addpoint-post', function (req, res) {
    let { lat, lng, pname, pdesc } = req.body

    let sql = `INSERT INTO survey (pname, pdesc, geom)VALUES(
        '${pname}', '${pdesc}', 
        ST_GeomFromText('POINT(${lng} ${lat})', 4326))`

    db.query(sql).then(r => {
        res.json({
            status: "insert done"
        })
    })
})

app.post('/api/removepoint', function (req, res) {
    let { gid } = req.body

    let sql = `DELETE FROM survey WHERE gid=${gid}`

    db.query(sql).then(r => {
        res.json({
            status: "remove done"
        })
    })
})

// analysis
app.post('/api/findvillage', function (req, res) {
    let { g } = req.body;
    let gText = JSON.stringify(g)
    console.log(gText)

    let sql = `SELECT *, ST_X(geom) as lng, ST_Y(geom) as lat FROM cm_vill_4326 v
                WHERE ST_DWithin(ST_Transform(v.geom, 32647), 
                ST_Transform(ST_GeomFromGeoJson(
                '${gText}'), 32647),
                3000)`

    db.query(sql).then(r => {
        res.json({
            status: 'select village',
            data: r.rows
        })
    })
})

app.post('/api/findroad', function (req, res) {
    let { g } = req.body;
    let gText = JSON.stringify(g)
    console.log(gText)

    let sql = `SELECT *, ST_AsGeoJSON(ST_FlipCoordinates(geom)) as geomtext 
                FROM cm_road_4326 r WHERE ST_intersects(r.geom, 
                ST_GeomFromGeojson('${gText}'))`

    db.query(sql).then(r => {
        res.json({
            status: 'select village',
            data: r.rows
        })
    })
})

app.get('/api/getmmcovid', (req, res) => {
    axios.get('https://thantthet.github.io/covid19-api/v2/state_district_wise.json')
        .then(res => { console.log(res) })
})

module.exports = app;