const path = require('path');
const read = require('node-readability');
const winston = require('winston');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const appconstants = require('./constants');

/**
 * get the path to the pages.json file
 */
const getPagesConfigFile = () =>  path.join(
        appconstants.CONFIG_FOLDER, 
        appconstants.CONFIG_CONTENT_PAGES
    );

/**
 * Get the path to a specific content file
 * @param {string} pageName 
 * @param {string} lang 
 */
const getContentOutputFile = (pageName, lang) => path.join(
        appconstants.CONTENT_CACHE, 
        `${pageName}_${lang}.html`
    );

const getErrorFile = (pageName, lang) => path.join(
        appconstants.CONTENT_CACHE, "error",
        `${pageName}_${lang}.html`
);

/**
 * Reads pages.json and generates static content for each of the listed content pages
 * for different languages.
 */
const processContentFiles = () => {
    fs.readFileAsync(getPagesConfigFile(), 'utf8')
        .then(
            (content) => {
                let objPages = JSON.parse(content);
                return objPages;
            }            
        ).then(
            (objPages) => {
                // first add the name to each of the content object
                // this will return an array within an array
                let contentWithName = objPages.pages.map(
                    page => page.content.map(
                        content => Object.assign({"name": page.name}, content)
                    )
                );
                // flatten the array to get a flat list of content children
                let contents = Array.prototype.concat(...contentWithName);
                // process each item in the array and generate page per language
                contents.forEach( (page) => processPage(page) );
            }
        );
};

/**
 * Process the page specified in pageInfo and process it
 * @param {object} pageInfo object with url, name and lang
 */
const processPage = (pageInfo) => {
    winston.log( "info", `processing page ${pageInfo.url} for lang ${pageInfo.lang}`);
    read(
        pageInfo.url,
        (err, article, meta) => {
            // page title and content
            let title = article.title;
            let content = article.content;
            // close the jsdom handle
            article.close();

            // render the page html
            let pageHtml = `<div class="aif-content-page"><h1>${title}</h1><div>${content}</div></div>`;
            
            // cleanup the page removing uneccesary footers
            let contentHtml =  pageCleanup(pageHtml);

            // get the output file name
            let outputFile = getContentOutputFile(pageInfo.name, pageInfo.lang);

            // write the file 
            fs.writeFileAsync(outputFile, contentHtml, {})
                .then(() => {
                    winston.log('info', 'wrote file ' + outputFile);
                })
                .catch(
                    (err) => {
                        winston.log('error', 'error while saving file', err);
                    }
                );
        }
    );
};

/**
 * Cleanup the html page
 * @param {string} pageHtml 
 */
const pageCleanup = (pageHtml) => {
    const domjs = new JSDOM(`${pageHtml}`);
    const foundElem = domjs.window.document.querySelector("#jp-post-flair");
    foundElem.parentNode.removeChild(foundElem);
    return domjs.serialize();
};

/**
 * Get the file from the file system
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @param {string} page 
 * @param {string} lang 
 */
function serveFile(req, res, next, page, lang) {
    let cmsPage = page.startsWith('_error') ? getErrorFile(page, lang) : getContentOutputFile(page, lang);
    fs.readFileAsync(cmsPage, 'utf8')
        .then(
            (content) => {
                const domjs = new JSDOM(`${content}`);
                const foundElem = domjs.window.document.querySelector("div.aif-content-page");
                res.set('Content-Type', 'text/html');
                res.send(foundElem.outerHTML);
            }
        ).catch( 
            (err) => {
                winston.log('error', "error while serving file " + page, err );
                let errLang = lang || "en" ;
                console.log(" ERR LANG ", errLang);
                serveFile(req, res, next, '_error', errLang);
            }
        );
}

// call this on module load to initialize the pages
// called subsequently on daily cron
processContentFiles();

module.exports.serveFile = serveFile;
module.exports.processContentFiles = processContentFiles;

