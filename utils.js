
function randomNItemsFromArray(array, n) {
    var shuffled = array.sort(function(){return .5 - Math.random()});
    var selected=shuffled.slice(0,n);
    return selected ;
}

module.exports = {
    randomNItemsFromArray: randomNItemsFromArray
};