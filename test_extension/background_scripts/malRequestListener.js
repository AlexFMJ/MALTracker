// intercept and cancel event request before it is sent
// save data to session

// target url requested by MAL after authenticating
var target = ['*://myanimelist.net/submission/authorization'];

// the index for the location header when the auth POST request is given
const location_index = 1;

console.log("webRequest.js Loaded!!");


function parseCode(raw_url) {
    // TODO Parse Url and save code + state to session data.
} 


function echoURL(details) {
    console.log("THIS IS A TEST!");
    
    // for (let header in details.responseHeaders) {
    //     console.log(details.responseHeaders[header])
    // };

    // Echoes the URL requested from MAL. Maybe there's a cleaner way to do it...
    console.log("URL: " + details.responseHeaders[location_index].value);

    parseCode(details.responseHeaders[location_index].value)

    // TODO Block request and close window
};

browser.webRequest.onHeadersReceived.addListener(
    echoURL,
    {urls: target},
    ["responseHeaders"]
    // ["blocking"]
);


// webRequest.onBeforeSendHeaders.removeListener(listener)
