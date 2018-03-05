/**
 * This module exposes the cron processes run on the server
 * It can be started with a standalone node instance:
 * 
 * .. code-block::bash
 *      node cron.js
 * 
 * or with the main service by passing WITH_CRON=1 as a environment prefix
 */
const schedule = require('node-schedule');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const winston = require('winston');


const filtercache = require('./filtercache');
const cmscontent = require('./cmscontent');

/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;
/**
 * 
 */
const CRON_FILTER_CACHE_CRON_SIGNATURE =   '*/7 * * * *'; // every 5 minutes  //'10 * * * * *' ;

/**
 * Runs a cron job to retreive the filter from the Data server as per CRON_FILTER_CACHE_CRON_SIGNATURE
 * This is a server side request
 */
var filterCacheCron = schedule.scheduleJob(
    CRON_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchFilter
);

const CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE =  '*/8 * * * *' ; // '*/5 * * * *'; // every 5 minutes  //'10 * * * * *' ;

/**
 * Runs a cron job to retreive the schedule as per CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE
 * This is a server side request
 */
var shortenFilterCacheCron = schedule.scheduleJob(
    CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchShortFilterCache
);


const CRON_SMART_FILTER_CACHE_CRON_SIGNATURE =  '*/1 * * * *' ; // '*/5 * * * *'; // every 5 minutes  //'10 * * * * *' ;

/**
 * Runs a cron job to retreive the schedule as per CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE
 * This is a server side request
 */
var smartFilterCacheCron = schedule.scheduleJob(
    CRON_SMART_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchSmartFilterCache
);

const CRON_CONTENT_PAGE_CRON_SIGNATURE = '0 0 12 * * *';

var cmsCacheCron = schedule.scheduleJob(
    CRON_CONTENT_PAGE_CRON_SIGNATURE,
    cmscontent.processContentFiles
);
// call it the first time when the cron is started
cmscontent.processContentFiles();

const  CRON_RECENT_DOCS_CRON_SIGNATURE = '*/3 * * * *';

var recentDocsCron = schedule.scheduleJob(
    CRON_RECENT_DOCS_CRON_SIGNATURE,
    filtercache.fetchRecentDocs
);

filtercache.fetchRecentDocs();

