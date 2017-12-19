const API_HOST = process.env.API_HOST || 'localhost' ;
const API_PORT = process.env.API_PORT || '8080' ;
const FOLDER_CACHE = 'portal-cache' ;
const FILE_FILTER_CACHE = 'full-filter-cache.json' ;
const FILE_SHORT_FILTER_CACHE = 'short-filter-cache.json';
const FILE_SMART_FILTER_CACHE = 'smart-filter-cache.json';
const API_FILTER_CACHE = 'http://' + API_HOST + ':' + API_PORT + '/exist/restxq/gw/filter-cache/json' ;

module.exports = {
    FOLDER_CACHE: FOLDER_CACHE,
    FILE_FILTER_CACHE: FILE_FILTER_CACHE,
    FILE_SHORT_FILTER_CACHE: FILE_SHORT_FILTER_CACHE,
    FILE_SMART_FILTER_CACHE: FILE_SMART_FILTER_CACHE,
    API_FILTER_CACHE: API_FILTER_CACHE
};