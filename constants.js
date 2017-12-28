const API_PROTOCOL = process.env.API_PROTOCOL || 'http' ;
const API_HOST = process.env.API_HOST || 'localhost' ;
const API_PORT = process.env.API_PORT || '8080' ;
const FOLDER_CACHE = 'portal-cache' ;
const FILE_FILTER_CACHE = 'full-filter-cache.json' ;
const FILE_SHORT_FILTER_CACHE = 'short-filter-cache.json';
const FILE_SMART_FILTER_CACHE = 'smart-filter-cache.json';

const API_SERVER_BASE = () =>
    API_PROTOCOL + '://' + API_HOST + ":" + API_PORT + '/exist/restxq';


const API_FILTER_CACHE =  API_SERVER_BASE() + '/gw/filter-cache/json' ;
const API_SEARCH_FILTER = API_SERVER_BASE() + '/gw/search/filter/json' ;

module.exports = {
    FOLDER_CACHE: FOLDER_CACHE,
    FILE_FILTER_CACHE: FILE_FILTER_CACHE,
    FILE_SHORT_FILTER_CACHE: FILE_SHORT_FILTER_CACHE,
    FILE_SMART_FILTER_CACHE: FILE_SMART_FILTER_CACHE,
    API_FILTER_CACHE: API_FILTER_CACHE,
    API_SEARCH_FILTER: API_SEARCH_FILTER
};