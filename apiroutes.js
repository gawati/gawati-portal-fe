const express = require('express');
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const pick = require('lodash.pick');

const filtercache = require('./filtercache');

/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;

var router = express.Router();

  /*
router.get(
  '/filter-cache', 
  filtercache.routeFilterCache

  function routeFilterCache(req, res, next) {
    fs.readFile(
        filtercache.getCacheFile(), 
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
 
);
 */


module.exports = router;
