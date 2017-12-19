
function randomNItemsFromArray(array, n) {
    var shuffled = array.sort(function(){return .5 - Math.random()});
    var selected=shuffled.slice(0,n);
    return selected ;
}


/**
 * Safely close a file handle
 * @param {object} fs 
 * @param {object} fd 
 */
function fsClose(fs, fd) {
    fs.close(fd, function(error) {
        if (error) {
            winston.log('error', 'closing error ' + error.message);
            return;
        } else {
            winston.log('File was closed !');
        }
    });
}


module.exports = {
    randomNItemsFromArray: randomNItemsFromArray,
    fsClose: fsClose
};