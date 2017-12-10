/**
 * This module exposes the cron processes run on the server
 */
const schedule = require('node-schedule');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const winston = require('winston');


const filtercache = require('./filtercache');
/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;
/**
 * 
 */
const CRON_FILTER_CACHE_CRON_SIGNATURE =  '12 * * * * *' ; // '*/5 * * * *'; // every 5 minutes  //'10 * * * * *' ;

/**
 * Runs a cron job to retreive the filter from the Data server as per CRON_FILTER_CACHE_CRON_SIGNATURE
 * This is a server side request
 */
var filterCacheCron = schedule.scheduleJob(
    CRON_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchFilter
    /*
    function getFilter() {
        console.log(" calling filterCacheCron ");
        axios.get(API_FILTER_CACHE)
            .then(getFilterResponseAndWriteIt)
            .catch(function scheduleJobError(error) {
                console.log(" scheduleJobError ", error);
                if (error) {
                    winston.log('error', 'error while retrieving filter response', error);
                }
            });
    }
    */
);

const CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE =  '18 * * * * *' ; // '*/5 * * * *'; // every 5 minutes  //'10 * * * * *' ;

/**
 * Runs a cron job to retreive the schedule as per CRON_SIGNATURE
 * This is a server side request
 */
var shortenFilterCacheCron = schedule.scheduleJob(
    CRON_SHORTEN_FILTER_CACHE_CRON_SIGNATURE,
    filtercache.fetchShortFilterCache
);


