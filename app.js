require('dotenv').config();

const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan('dev'));

const cors = require("cors");
app.use(cors());

module.exports = app;