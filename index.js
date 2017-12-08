const express = require('express');
const path = require('path');
const routes = require('./apiroutes');
const app = express();

//app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/gwp', routes);
app.use('/gwp/full-filter-cache', express.static(path.join('portal-cache', 'filter-cache.json')));

const cron = require('./cron');

module.exports = app;
