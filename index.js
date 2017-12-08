const express = require('express');
const path = require('path');
const routes = require('./apiroutes');
const app = express();

//app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/gwp', routes)

const cron = require('./cron');

module.exports = app;
