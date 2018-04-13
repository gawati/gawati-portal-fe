/**
 * This module exposes the cron processes run on the server
 * It can be started with a standalone node instance:
 * 
 * .. code-block::bash
 *      node cron.js
 * 
 * or with the main service by passing WITH_CRON=1 as a environment prefix
 */
const schedule = require("node-schedule");
const filtercache = require("./filtercache.js");
const cmscontent = require("./cmscontent.js");


const NODE_ENV = process.env.NODE_ENV || "production";

console.log(`Starting in ${NODE_ENV} mode`);

/**
 *  Run every 7 minutes
 */
const CRON_FILTER_CACHE_CRON_SIGNATURE =  NODE_ENV === "development" ? "*/1 * * * *" : "*/7 * * * *"; 

/**
 * Runs a cron job to retreive the filter from the Data server as per CRON_FILTER_CACHE_CRON_SIGNATURE
 * This is a server side request
 */
var filterCacheCron = schedule.scheduleJob(
    CRON_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchFilter
);
/*
* Run every 1 minute
*/
const CRON_SMART_FILTER_CACHE_CRON_SIGNATURE =  "*/1 * * * *" ; // '*/5 * * * *'; // every 5 minutes  //'10 * * * * *' ;

/**
 * Runs a cron job to retreive the schedule as per CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE
 * This is a server side request
 */
var smartFilterCacheCron = schedule.scheduleJob(
    CRON_SMART_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchSmartFilterCache
);

/*
* Run every 12 hours
*/

const CRON_CONTENT_PAGE_CRON_SIGNATURE = "0 0 12 * * *";

var cmsCacheCron = schedule.scheduleJob(
    CRON_CONTENT_PAGE_CRON_SIGNATURE,
    cmscontent.processContentFiles
);
// call it the first time when the cron is started
cmscontent.processContentFiles();

/*
* Run every 3 minutes
*/

// const  CRON_RECENT_DOCS_CRON_SIGNATURE = '*/3 * * * *';

// var recentDocsCron = schedule.scheduleJob(
//     CRON_RECENT_DOCS_CRON_SIGNATURE,
//     filtercache.fetchRecentDocs
// );

// filtercache.fetchRecentDocs();

