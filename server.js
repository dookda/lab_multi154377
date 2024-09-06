const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get("/api", (req, res) => {
    // console.log("hello");
    res.status(200).json({ "status": "success" })
})

const markers = [{
    id: 1,
    name: "marker1",
    marker: [18.97513, 98.952484]
}, {
    id: 2,
    name: "marker2",
    marker: [18.802968, 98.992825]
}]

app.get("/api/markers/:id", (req, res) => {
    const id = req.params.id;
    const mk = markers.find(m => m.id == id);
    res.status(200).json(mk)
})

app.post("/api/markers", (req, res) => {
    const { id } = req.body;
    // console.log(req.body);
    const mk = markers.find(m => m.id == id)
    res.status(200).json(mk)
})

app.put('/api/v1/addowner/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;

    const mk = markers.find(m => m.id == id)
    mk.name = name
    res.status(200).json(mk)
})

app.use('/', express.static('www'))
app.use(require('./service'))

app.listen(3000, () => {
    console.log("http://localhost:3000")
});

