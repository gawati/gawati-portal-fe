const express = require('express');
const path = require('path');
const routes = require('./apiroutes');
const appconstants = require('./constants');
const cron = require('./cron');

const app = express();

//app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/gwp', routes);

app.use(
    '/gwp/full-filter-cache', 
    express.static(
        path.join(
            appconstants.FOLDER_CACHE, 
            appconstants.FILE_FILTER_CACHE
        )
    )
);

app.use(
    '/gwp/short-filter-cache', 
    express.static(
        path.join(
            appconstants.FOLDER_CACHE, 
            appconstants.FILE_SHORT_FILTER_CACHE
        )
    )
);

module.exports = app;
