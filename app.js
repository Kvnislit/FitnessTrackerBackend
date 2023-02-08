require('dotenv').config();
const PORT = process.env.PORT || 3000;

const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan('dev'));

const cors = require("cors");
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);

const { client } = require("./db");

app.use((err, req, res, next) => {
    res.status(500).send(err);
})

app.use((err, req, res, next) => {
    res.status(404).send(err);
})

app.listen(PORT, async () => {
    console.log(`Running on port: ${PORT}`);
    await client.connect();
});

module.exports = app;