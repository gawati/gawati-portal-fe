const axios = require("axios");
const appconstants = require("./constants");

/**
 * Specifies the filter configuration
 * The filter configuration is used to construct the XQuery. 
 * this is typically converted to the form: 
 *    [ {xqueryElementXPath}[{xqueryAttr} eq '{incomingFilterValue}' {or...} ] ]
 * for example if the incoming filter value is for "countries" :
 * 
 *  "countries":["bf","mr"]
 * 
 * then the Query is constructed as:
 * 
 * [ .//an:FRBRcountry[@value eq 'bf' or @value eq 'mr' ] ]
 * 
 * if it is for "langs":
 * 
 *  "langs":["eng"], 
 * 
 * then the Query is constructed as:
 * 
 * [ .//an:FRBRlanguage[ @language eq 'eng' ]] 
 *    
 */
const filterConfig = {
    "countries": {
        xqueryElementXPath: ".//an:FRBRcountry",
        xqueryAttr: "@value"
    },
    "langs": {
        xqueryElementXPath: ".//an:FRBRlanguage",
        xqueryAttr: "@language"
    }
};

const convertEncodedStringToObject = (aString) =>
    JSON.parse(decodeURIComponent(aString)) ;

/*
    const convertObjectToEncodedString = (obj) =>
    encodeURIComponent(JSON.stringify(obj)) ;
*/

const searchFilter = (req) => {
    console.log(" searchFilter req.query ", req.query);
    let filter = convertEncodedStringToObject(req.query.q);
    let count = 1; // req.query.count || "10" ; 
    let from = 1 ; //req.query.from || "1" ;
    let xQueryFilter = xQueryFilterBuilder(filter).join("");
    let filterObj = {
        count: count, 
        from: from, 
        q: xQueryFilter
    };
    return filterObj;
};
  


/**
 * Queries the service for the filter cache api.
 * This is called by the CRON service
 */
const searchFilterQuery = (filterObj) => {
    console.log(" FILTER OBJ ", filterObj);
    return axios.get(appconstants.API_SEARCH_FILTER, filterObj).then(
        (response) => {
            return response.data;
        }
    );
};



/**
 * This returns an XQuery query which is sent to the data server
 * as a server side query
 * @param {object} filter incoming filter object from client
 * This is typically sent in the format as below: 
 * { 
 *      "langs":["eng"], 
 *      "countries":["bf","mr"]
 *  }
 */
function xQueryFilterBuilder(filter) {
    // the root document collection
    let xQuery = [];
    
    for (let filterName in filter) {
        
        let cfg = filterConfig[filterName];
        
        let attrQuery = filter[filterName].map(
            value =>`${cfg.xqueryAttr} eq '${value}'`
        ).join(" or ");
        
        xQuery.push(
            `[${cfg.xqueryElementXPath}[ ${attrQuery} ]]`
        );
    
    }
    return xQuery;
}

module.exports.xQueryFilterBuilder = xQueryFilterBuilder;
module.exports.searchFilterQuery = searchFilterQuery;
module.exports.searchFilter = searchFilter;