var express = require('express');
var router = express.Router();


router.get(
  '/filter-cache', 
  function routeFilterCache(req, res, next) {
    res.json({info:"Hello World"});
  }
);

module.exports = router;
