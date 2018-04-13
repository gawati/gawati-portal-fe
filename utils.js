const logr = require("./logging.js");
const appconstants = require("./constants.js");

function randomNItemsFromArray(array, n) {
    var shuffled = array.sort(function(){return .5 - Math.random();});
    var selected=shuffled.slice(0,n);
    return selected ;
}

function serverMsg(message) {
    return `${appconstants.PROCESS_NAME_PORTAL_SERVER}: ${message}`;
}


function cronMsg(message) {
    return `${appconstants.PROCESS_NAME_PORTAL_SERVER_CRON}: ${message}`;
}



/**
 * Safely close a file handle
 * @param {object} fs 
 * @param {object} fd 
 */
function fsClose(fs, fd) {
    fs.close(fd, function(error) {
        if (error) {
            logr.error(serverMsg("closing error " + error.message), error);
            return;
        } else {
            logr.debug("File was closed");
        }
    });
}

function validateJSON(jsonContent) {
    try {
        var data = JSON.parse(jsonContent);
        return data;
    } catch (e) {
        return null;
    }
}

function objectIsEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object ;
}



module.exports = {
    randomNItemsFromArray: randomNItemsFromArray,
    fsClose: fsClose,
    objectIsEmpty: objectIsEmpty,
    validateJSON: validateJSON,
    serverMsg: serverMsg,
    cronMsg: cronMsg
};