/*jslint es6 */
const path = require("path");
const fs = require("fs");
const pick = require("lodash.pick");
const axios = require("axios");
const apputils = require("./utils.js");
const logr = require("./logging.js");
const appconstants = require("./constants.js");

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
                if (error) {
                    logr.error(
                        apputils.cronMsg("fetchFilter.scheduleJobError error while retrieving filter response"), 
                        error
                    );
                }
            }
        );
}

function fetchRecentDocs() {
    axios.get(appconstants.API_RECENT)
        .then(
            (response) => {
                return responseFetch(response, getRecentCache());
            })
        .catch(
            function scheduleJobError(error) {
                if (error) {
                    logr.error( apputils.cronMsg("fetchRecentDocs error while retrieving filter response"), error);
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
function responseFetch(response, cacheFile) {
    let responseData = response.data; 
    fs.writeFile(
        cacheFile, 
        JSON.stringify(responseData), 
        "utf8",
        function writeFileError(error) {
            if (error) {
                logr.error(
                    apputils.cronMsg("responseFetch error while writing response to " + cacheFile), 
                    error
                );
            }
        }  
    );
    logr.info( apputils.cronMsg("success: created cache " + cacheFile)); 
}



/**
 * Called by getFilter().
 * Retrieves the filter response from the Data server and Writes it to the JSON file
 * 
 * @param {object} response 
 */
function responseFetchFilter(response) {
    let filterData = response.data; 
    fs.writeFile(
        getCacheFile(), 
        JSON.stringify(filterData), 
        "utf8",
        function writeFileError(error) {
            if (error) {
                logr.error(
                    apputils.cronMsg("responseFetchFilter error while writing filter response "), 
                    error
                );
            }
        }  
    );
    logr.info(apputils.cronMsg(": success: created full filter cache ")); 
}


/**
 * Called by fetchShortFilterCache; Reads the full cache file and sends
 * the data for further processing
 */
/*
function readFullCacheFileAndProcess() {
    fs.readFile(
        getCacheFile(), 
        "utf8", 
        processRouteFilterCache
    );

}
*/

/**
 * Generates the Short Filter Cache file
 * @param {*} error 
 * @param {*} data 
 */
/*
function processRouteFilterCache(error, data) {
    if (error) {
        logr.error(apputils.cronMsg("processRouteFilterCache error while reading full filter cache"), error);
        return;
    } else {
        // filter the object
        var filterObj = apputils.validateJSON(data);
        if (filterObj === null) {
            logr.error(
                apputils.cronMsg("processRouteFilterCache possibly an error condition, the filter cache was not a valid json file, exiting gracefully")
            );
            return;
        }
        let shortFilter = {
            "timestamp": filterObj.timestamp, 
            "filter": filterObj.filter.map(
                // call filterByName to filter the array by name
                filterByName
            )
        };
        // write the shortened object to file
        fs.writeFile(
            getShortCacheFile(), 
            JSON.stringify(shortFilter), 
            "utf8",
            function writeFileError(error) {
                if (error) {
                    logr.error(
                        apputils.cronMsg("processRouteFilterCache error while writing short filter response "),
                        error
                    );
                }
            }  
        );
        logr.info(apputils.cronMsg(" success: created short filter cache"));
    }
}
*/

/**
 * Reads the full cache and generates a short-cache file
 */
function fetchSmartFilterCache() {
    // read the cache file
    fs.stat(getCacheFile(), (error) => {
        if (error == null) {
            readFullCacheFileAndSmartProcess();
        } else
        if (error.code === "ENOENT") {
            logr.info(
                apputils.cronMsg("fetchSmartFilterCache file does not exist yet"), 
                error
            );
            return;
        } else {
            logr.error(
                apputils.cronMsg("fetchSmartFilterCache error while opening file "), 
                error
            );
            return;
        }
        // not clear from the documentation, but fs.readFile() does not require closing the file handle apparently
        ///apputils.fsClose(fs, fd);
    });
}

/**
 * Called by fetchShortFilterCache; Reads the full cache file and sends
 * the data for further processing
 */
function readFullCacheFileAndSmartProcess() {
    fs.readFile(
        getCacheFile(), 
        "utf8", 
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
        logr.error(
            apputils.cronMsg("processRouteSmartFilterCache error while reading smart filter cache"), 
            error
        );
        return;
    } else {
        // filter the object
        var filterObj = apputils.validateJSON(data);
        if (filterObj === null) {
            logr.info(
                apputils.cronMsg("processRouteSmartFilterCache the full cache filter JSON was null, possibly an error condition, exiting gracefully")
            );
            return;
        }
        let shortFilter = {
            "timestamp": filterObj.timestamp, 
            "filter": filterObj.filter.map(
                // call filterByName to filter the array by name
                smartFilterByName
            )
        };
        // write the shortened object to file
        fs.writeFile(
            getSmartCacheFile(), 
            JSON.stringify(shortFilter), 
            "utf8",
            function writeFileError(error) {
                if (error) {
                    logr.error(
                        apputils.cronMsg(
                            "processRouteSmartFilterCache error while writing short filter response "
                        ), 
                        error
                    );
                }
            }  
        );
        logr.info(apputils.cronMsg("success: created smart filter cache"));
    }
}

function smartFilterByName(filterValue) {
    switch(filterValue.name) {
    case "keywords":
        return remapKeyWords(filterValue);
    default:
        return filterValue;
    }
}

function remapKeyWords(filterValue) {
    const KW = "keyword";
    const KW_THRESHOLD = 50; 
    var filterMap = pick(filterValue, ["name", "label"]);
    try {
        if(!apputils.objectIsEmpty(filterValue)) {
            if (filterValue.hasOwnProperty(KW)) {
                if (filterValue[KW].length <= KW_THRESHOLD) {
                    filterMap[KW] = filterValue[KW];
                } else {
                    filterMap[KW] = apputils.randomNItemsFromArray(
                        filterValue[KW], 
                        KW_THRESHOLD
                    );
                }
            }
        }
    } catch (error) {
        logr.error("Exception in remapKeywords ", error);
    }
    return filterMap;
}
  

/*
function remapFilter(value, key, size) {
    var filterMap = pick(value, ["name", "label"]);
    filterMap[key] = value[key].slice(0, size);
    return filterMap;
}
*/

/* 
function filterByName(filterValue) {
    let size =  5;
    switch(filterValue.name) {
    case "countries":
        return remapFilter(filterValue, "country", size);
    case "langs":
        return remapFilter(filterValue, "lang", size);
    case "years":
        return remapFilter(filterValue, "year", size);
    case "keywords":
        return remapFilter(filterValue, "keyword", size);
    }
}
 */  
  

/**
 * Returns the Cache file
 * 
 * @returns path to the cache file 
 */
function getCacheFile() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_FILTER_CACHE);
}

function getRecentCache() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_RECENT_CACHE);
}

function getShortCacheFile() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_SHORT_FILTER_CACHE);
}

function getSmartCacheFile() {
    return path.join(appconstants.FOLDER_CACHE, appconstants.FILE_SMART_FILTER_CACHE);
}

module.exports.getCacheFile = getCacheFile;
module.exports.getShortCacheFile = getShortCacheFile;
module.exports.fetchFilter = fetchFilter;
//module.exports.getFilterResponseAndWriteIt = getFilterResponseAndWriteIt;
module.exports.fetchSmartFilterCache = fetchSmartFilterCache;
module.exports.fetchRecentDocs = fetchRecentDocs;