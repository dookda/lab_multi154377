const express = require('express');
const app = express();
const Pool = require('pg').Pool

const db = new Pool({
    host: 'localhost',
    database: 'geo377',
    user: 'sakdahomhuan',
    password: '1234',
    port: 5432,
});

app.get("/api/v1/houses", (req, res) => {
    const sql = "SELECT * FROM houses";
    db.query(sql).then((r) => {
        res.status(200).json(r.rows)
    })
})

app.get("/api/v1/houses/:address", (req, res) => {
    const { address } = req.params
    const sql = `SELECT * FROM houses WHERE address LIKE '%${address}%'`
    db.query(sql).then((r) => {
        res.status(200).json(r.rows)
    })
})

app.post("/api/v1/houses", (req, res) => {
    const { address, mkname, lng, lat } = req.body
    const sql = `INSERT INTO houses (address, mkname, geom)
                 VALUES('${address}', '${mkname}', 
                        ST_MakePoint(${lng}, ${lat}));`
    db.query(sql).then(() => {
        res.status(200).json({ status: "success!!" })
    })
})

app.put("/api/v1/houses/:gid/:address", (req, res) => {
    const { gid, address } = req.params
    const sql = `UPDATE houses SET address='${address}'
                 WHERE gid=${gid}`
    db.query(sql).then(() => {
        res.status(200).json({ status: "success!!" })
    })
})

app.delete("/api/v1/houses/:gid", (req, res) => {
    const { gid } = req.params
    const sql = `DELETE FROM houses WHERE gid = ${gid}`
    db.query(sql).then(() => {
        res.status(200).json({ status: "success!!" })
    })
})

app.get("/api/v1/village/:tam", (req, res) => {
    const { tam } = req.params
    const sql = `SELECT * FROM cm_dwr_village_4326 
                    WHERE tam_nam_t LIKE '%${tam}%'`;
    db.query(sql).then((r) => {
        res.status(200).json(r.rows)
    })
})

// สร้าง API เรียกข้อมูลหมู่บ้าน /api/v1/village/:tam



module.exports = app;