const path = require('path');
const fs = require('fs');
const winston = require('winston');
const pick = require('lodash.pick');
const axios = require('axios');
const appconstants = require('./constants');

/**
 * Queries the service for the filter cache api.
 * This is called by the CRON service
 */
function fetchFilter() {
    axios.get(appconstants.API_FILTER_CACHE)
        // call responseFetchFilter()
        .then(responseFetchFilter)
        .catch(
            function scheduleJobError(error) {
                console.log(" scheduleJobError ", error);
                if (error) {
                    winston.log('error', 'error while retrieving filter response', error);
                }
            }
        );
}


/**
 * Called by getFilter().
 * Retrieves the filter response from the Data server and Writes it to the JSON file
 * 
 * @param {object} response 
 */
function responseFetchFilter(response) {
    let filterData = response.data; 
    console.log(" responseGetFilter ");
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
    console.log(" success: created full filter cache"); 
}

/**
 * Responds to HTTP get request for the filter cache
 * @param {object} req HTTP Request object 
 * @param {object} res HTTP Response object
 * @param {*} next 
 */
/*
function routeFilterCache(req, res, next) {
    fs.readFile(
        getCacheFile(), 
        'utf8', 
        function processRouteFilterCache(error, data) {
          if (error) {
            winston.log('error', 'error while reading full filter cache', error);
          } else {
            var filterObj = JSON.parse(data);
            let shortFilter = {
                'timestamp': filterObj.timestamp, 
                'filter': filterObj.filter.map(
                    filterByName
                  )
             };
            console.log(" SHORT JSON ", shortFilter);
            fs.writeFile(
              filtercache.getShortCacheFile(), 
              JSON.stringify(shortFilter), 
              'utf8',
              function writeFileError(error) {
                if (error) {
                    winston.log(
                        'error', 
                        'error while writing short filter response ', 
                        error
                    );
                }
              }  
            );
            res.json({'timestamp': filterObj.timestamp, 'filter': shortFilter});      
          }
      }
    );
  }
*/
/**
 * Reads the full cache and generates a short-cache file
 */
function fetchShortFilterCache() {
    // read the cache file
    fs.open(getCacheFile(), 'r', (error, fd) => {
        if (error) {
            if (error.code === 'ENOENT') {
                winston.log('error', 'file does not exist', error);
                return;
            } else {
                winston.log('error', 'error while opening file ', error);
                return;
            }
        }
        readFullCacheFileAndProcess();
    });
}

/**
 * Called by fetchShortFilterCache; Reads the full cache file and sends
 * the data for further processing
 */
function readFullCacheFileAndProcess() {
    fs.readFile(
        getCacheFile(), 
        'utf8', 
        processRouteFilterCache
    );

}

/**
 * Generates the Short Filter Cache file
 * @param {*} error 
 * @param {*} data 
 */
function processRouteFilterCache(error, data) {
    if (error) {
      winston.log('error', 'error while reading full filter cache', error);
      return;
    } else {
        // filter the object
      var filterObj = JSON.parse(data);
      let shortFilter = {
          'timestamp': filterObj.timestamp, 
          'filter': filterObj.filter.map(
              // call filterByName to filter the array by name
              filterByName
            )
       };
      // write the shortened object to file
      fs.writeFile(
        getShortCacheFile(), 
        JSON.stringify(shortFilter), 
        'utf8',
        function writeFileError(error) {
          if (error) {
              winston.log(
                  'error', 
                  'error while writing short filter response ', 
                  error
              );
          }
        }  
      );
      console.log(" success: created short filter cache");
      //res.json({'timestamp': filterObj.timestamp, 'filter': shortFilter});      
    }
}



function remapFilter(value, key) {
    var filterMap = pick(value, ['name', 'label']);
    filterMap[key] = value[key].slice(0,5);
    return filterMap;
  }
  
  function filterByName(filterValue) {
    switch(filterValue.name) {
      case "countries":
          return remapFilter(filterValue, 'country');
        break;
      case "langs":
          return remapFilter(filterValue, 'lang');
        break;
      case "years":
          return remapFilter(filterValue, 'year');
        break;
      case "keywords":
          return remapFilter(filterValue, 'keyword');
        break;
    }
  }
  
  

/**
 * Returns the Cache file
 * 
 * @returns path to the cache file 
 */
function getCacheFile() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_FILTER_CACHE);
}


function getShortCacheFile() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_SHORT_FILTER_CACHE);
}




//module.exports.getCacheFile = getCacheFile;
//module.exports.getShortCacheFile = getShortCacheFile;
module.exports.fetchFilter = fetchFilter;
//module.exports.getFilterResponseAndWriteIt = getFilterResponseAndWriteIt;
module.exports.fetchShortFilterCache = fetchShortFilterCache;