/**
 * Reads and parses url sent from MAL to localhost:5500
 * Saves code and state params to session storage
 */

console.log("loaded!");


// target url requested by MAL after authenticating
const target = ['*://myanimelist.net/submission/authorization'];

// the index for the location header when the auth POST request is given
const location_index = 1; 


/**
 * Parses the url value from getURL, then saves code and state to session
 * @param {*string} baseURL 
 */
function parseCode(baseURL) {
    // prepare query string for URLSearchParams by removing everything before "?"
    const authParams = baseURL.substring(baseURL.indexOf("?"));

    // call URLSearchParams to make objects from any params contained in the url
    const urlParams = new URLSearchParams(authParams);


    // check if params includes code, then submit and whatnot
    if (urlParams.has("code")) {
        console.log("code: ");
        console.log(urlParams.get("code"));
    }
    else {
        console.log("No Code Found!");
    };


    if (urlParams.has("state")) {
        console.log("state: ");
        console.log(urlParams.get("state"));
    }
    else {
        console.log("No State Found!");
    };
};


/**
 * Listener for browser.webRequest.onHeadersRecieved
 * @param {*object} details 
 */
function getURL(details) {
    // TODO: Close Tab
    
    // Location_index should always be the same from responseHeaders, 
    // Result: string containing redirect URL requested by MAL to localhost
    const baseURL = details.responseHeaders[location_index].value;

    parseCode(baseURL);
    // TODO Block request and close window
};

browser.webRequest.onHeadersReceived.addListener(
    getURL,
    {urls: target},
    ["responseHeaders"]
    // ["blocking"] // Maybe block the request here?
);

// TODO: When do I remove the listener and this whole script?
// webRequest.onBeforeSendHeaders.removeListener(listener)
