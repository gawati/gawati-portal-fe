const express = require('express');
const path = require('path');
const routes = require('./apiroutes');
const appconstants = require('./constants');

// uncomment the below if you want to run cron as part of the web service process
//const cron = require('./cron');

const app = express();

/**
 * Use the WITH_CRON=1 environment variables to start cron within this node process
 */
if (process.env.WITH_CRON === '1' ) {
    const cron = require('./cron');
    console.log(" Starting Server with cron ");
} else {
    console.log(" Starting Server without cron");
}

/**
 * Use the WITH_CLIENT=1 environment variables to start with the static client
 */
if (process.env.WITH_CLIENT === '1') {
    console.log(" Deploying Client...on /v2 ");
    app.use('/v2', express.static(path.join(__dirname, 'client/build')))
}

console.log(" Deploying Services... ");
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
