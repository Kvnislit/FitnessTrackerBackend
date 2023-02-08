require('dotenv').config();
const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan('dev'));

const cors = require("cors");
app.use(cors());

const api = require("./api");
app.use('/api',api);

module.exports = app;