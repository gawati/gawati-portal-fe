const path = require('path');
const fs = require('fs');
const winston = require('winston');
const pick = require('lodash.pick');
const axios = require('axios');
const apputils = require('./utils');
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


/**
 * Reads the full cache and generates a short-cache file
 */
function fetchSmartFilterCache() {
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
        readFullCacheFileAndSmartProcess();
    });
}

/**
 * Called by fetchShortFilterCache; Reads the full cache file and sends
 * the data for further processing
 */
function readFullCacheFileAndSmartProcess() {
    fs.readFile(
        getCacheFile(), 
        'utf8', 
        processRouteSmartFilterCache
    );

}


/**
 * Generates the Short Filter Cache file
 * @param {*} error 
 * @param {*} data 
 */
function processRouteSmartFilterCache(error, data) {
    if (error) {
      winston.log('error', 'error while reading smart filter cache', error);
      return;
    } else {
        // filter the object
      var filterObj = JSON.parse(data);
      let shortFilter = {
          'timestamp': filterObj.timestamp, 
          'filter': filterObj.filter.map(
              // call filterByName to filter the array by name
              smartFilterByName
            )
       };
      // write the shortened object to file
      fs.writeFile(
        getSmartCacheFile(), 
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
      console.log(" success: created smart filter cache");
      //res.json({'timestamp': filterObj.timestamp, 'filter': shortFilter});      
    }
}

function smartFilterByName(filterValue) {
    let size =  5;
    switch(filterValue.name) {
      case "keywords":
          return remapKeyWords(filterValue);
        break;
      default:
          return filterValue;
        break;
    }
  }

function remapKeyWords(filterValue) {
    const KW = 'keyword';
    const KW_THRESHOLD = 10; 
    var filterMap = pick(filterValue, ['name', 'label']);
    if (filterValue[KW].length <= KW_THRESHOLD) {
        filterMap[KW] = filterValue[KW];
    } else {
        filterMap[KW] = apputils.randomNItemsFromArray(
            filterValue[KW], 
            KW_THRESHOLD
        );
    }
    return filterMap;
}
  


function remapFilter(value, key, size) {
    var filterMap = pick(value, ['name', 'label']);
    filterMap[key] = value[key].slice(0, size);
    return filterMap;
  }



function filterByName(filterValue) {
    let size =  5;
    switch(filterValue.name) {
      case "countries":
          return remapFilter(filterValue, 'country', size);
        break;
      case "langs":
          return remapFilter(filterValue, 'lang', size);
        break;
      case "years":
          return remapFilter(filterValue, 'year', size);
        break;
      case "keywords":
          return remapFilter(filterValue, 'keyword', size);
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

function getSmartCacheFile() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_SMART_FILTER_CACHE);
}

//module.exports.getCacheFile = getCacheFile;
//module.exports.getShortCacheFile = getShortCacheFile;
module.exports.fetchFilter = fetchFilter;
//module.exports.getFilterResponseAndWriteIt = getFilterResponseAndWriteIt;
module.exports.fetchShortFilterCache = fetchShortFilterCache;
module.exports.fetchSmartFilterCache = fetchSmartFilterCache;