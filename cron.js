/**
 * This module exposes the cron processes run on the server
 */
const schedule = require('node-schedule');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const winston = require('winston');
/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;
/**
 * 
 */
const CRON_SIGNATURE =  '10 * * * * *' ;

const API_FILTER_CACHE = 'http://localhost:8080/exist/restxq/gw/filter-cache/json' ;

const FILE_FILTER_CACHE = 'filter-cache.json' ;

/**
 * Runs a cron job to retreive the schedule every 
 */
var filterCacheCron = schedule.scheduleJob(
    CRON_SIGNATURE,
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
);

/**
 * Retrieves the filter response
 * and Writes it to the JSON file
 * 
 * @param {object} response 
 */
function getFilterResponseAndWriteIt(response) {
    let filterData = response.data; 
    console.log(" getFilterResponseAndWriteIt ");
    fs.writeFile(
        getCacheFile(), 
        JSON.stringify(filterData), 
        'utf8',
        function writeFileError(error) {
            if (error) {
                winston.log(
                    'error', 
                    'error while writing filter response ', 
                    error
                );
            }
        }  
    );
}

/**
 * Returns the Cache file
 * 
 * @returns path to the cache file 
 */
function getCacheFile() {
    return path.join('..', 'portal-cache', FILE_FILTER_CACHE);
}

exports.filterCacheCron = filterCacheCron;
