const winston = require('winston');
/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
      /*,
      new (winston.transports.File)({ filename: 'gawati-portal-server.log' })
      */
    ]
  });

module.exports = logger; 

