const API_PROTOCOL = process.env.API_PROTOCOL || "http" ;
const API_HOST = process.env.API_HOST || "localhost" ;
const API_PORT = process.env.API_PORT || "8080" ;

/** Folders */
const CONFIG_FOLDER = "configs" ;
const FOLDER_CACHE = "portal-cache" ;
const CONTENT_CACHE = "content-cache" ;

/** Config Files */
const CONFIG_CONTENT_PAGES = "pages.json" ;

/** Runtime Files */
const FILE_FILTER_CACHE = "full-filter-cache.json" ;
const FILE_SHORT_FILTER_CACHE = "short-filter-cache.json";
const FILE_SMART_FILTER_CACHE = "smart-filter-cache.json";
const FILE_RECENT_CACHE = "recent-docs.json";
const AUTH_JSON = "auth.json";
const PROFILE_JSON = "profile.json";

const API_SERVER_BASE = () =>
    API_PROTOCOL + "://" + API_HOST + ":" + API_PORT + "/exist/restxq";


const API_FILTER_CACHE =  API_SERVER_BASE() + "/gw/filter-cache/json" ;
const API_RECENT = API_SERVER_BASE() + "/gw/recent/expressions/summary/json?count=4&from=1&to=4" ;
const API_SEARCH_FILTER = API_SERVER_BASE() + "/gw/search/filter/json" ;
const PROCESS_NAME_PORTAL_SERVER = "PORTAL-SERVER";
const PROCESS_NAME_PORTAL_SERVER_CRON = "PORTAL-CRON";

module.exports = {
    CONFIG_FOLDER: CONFIG_FOLDER,
    CONFIG_CONTENT_PAGES: CONFIG_CONTENT_PAGES,
    CONTENT_CACHE: CONTENT_CACHE,
    FOLDER_CACHE: FOLDER_CACHE,
    FILE_FILTER_CACHE: FILE_FILTER_CACHE,
    FILE_SHORT_FILTER_CACHE: FILE_SHORT_FILTER_CACHE,
    FILE_SMART_FILTER_CACHE: FILE_SMART_FILTER_CACHE,
    FILE_RECENT_CACHE: FILE_RECENT_CACHE,
    AUTH_JSON: AUTH_JSON,
    PROFILE_JSON: PROFILE_JSON,
    API_FILTER_CACHE: API_FILTER_CACHE,
    API_SEARCH_FILTER: API_SEARCH_FILTER,
    API_RECENT: API_RECENT,
    PROCESS_NAME_PORTAL_SERVER: PROCESS_NAME_PORTAL_SERVER,
    PROCESS_NAME_PORTAL_SERVER_CRON: PROCESS_NAME_PORTAL_SERVER_CRON
};