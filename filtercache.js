const path = require('path');
const fs = require('fs');

const FOLDER_CACHE = 'portal-cache' ;
const FILE_FILTER_CACHE = 'filter-cache.json' ;
const FILE_SHORT_FILTER_CACHE = 'short-filter-cache.json';

const API_FILTER_CACHE = 'http://localhost:8080/exist/restxq/gw/filter-cache/json' ;

/**
 * Queries the service for the filter cache api.
 * This is called by the CRON service
 */
function getFilter() {
    axios.get(API_FILTER_CACHE)
        .then(responseGetFilter)
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
function responseGetFilter(response) {
    let filterData = response.data; 
    console.log(" responseGetFilter ");
    fs.writeFile(
        filtercache.getCacheFile(), 
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

/**
 * Returns the Cache file
 * 
 * @returns path to the cache file 
 */
function getCacheFile() {
    return path.join(FOLDER_CACHE, FILE_FILTER_CACHE);
}


function getShortCacheFile() {
    return path.join(FOLDER_CACHE, FILE_SHORT_FILTER_CACHE);
}




module.exports.getCacheFile = getCacheFile;
module.exports.getShortCacheFile = getShortCacheFile;
module.exports.getFilter = getFilter;
module.exports.getFilterResponseAndWriteIt = getFilterResponseAndWriteIt;
module.exports.routeFilterCache = routeFilterCache;