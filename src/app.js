const express = require('express');
const path = require('path');
const logger = require('morgan');

const { getConfig } = require('../src/config');
const routes = require('./routes');

const app = express();
const { publicDir } = getConfig();

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(publicDir));

app.use('/', routes);

module.exports = app;
