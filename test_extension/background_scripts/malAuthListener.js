/**
 * Reads and parses url sent from MAL to localhost:5500
 * Saves code and state params to session storage, then gets oAuth tokens
 */

// the index for the location header when the auth POST request is given
// if this proves an issue later, make a function that searches for the location key instead
const location_index = 1;

// target url requested by MAL after pressing agree on authentication dialogue
const target = ['*://myanimelist.net/submission/authorization'];

// token URL info
const config = {
    client_id: "92b69132bb2ffad84cccada01aef0d18",
    redirect_uri: "http://localhost:8080/tests/OAuth_PKCE/test.html",
    token_endpoint: "https://myanimelist.net/v1/oauth2/token"
};


// check for script
console.log("loaded!");


/**
 * Listener for browser.webRequest.onHeadersRecieved
 * @param {object} details 
 */
function getURL(details) {
    // Location_index should always be the same from responseHeaders, 
    // Result: string containing redirect URL requested by MAL to localhost
    const authURL = details.responseHeaders[location_index].value;

    parseCode(authURL);
    // TODO Block request and close window
};


/**
 * Parses the url value from getURL, then saves code and state to session
 * @param {string} authURL 
 */
function parseCode(authURL) {
    // prepare query string for URLSearchParams by removing everything before "?"
    const authParams = authURL.substring(authURL.indexOf("?"));

    // call URLSearchParams to make objects from any params contained in the url
    const urlParams = new URLSearchParams(authParams);


    // check if params includes code
    if (urlParams.has("code")) {
        console.log("code: ");
        console.log(urlParams.get("code"));
        localStorage.setItem("auth_code", urlParams.get("code"));
    }
    // TODO: raise an error if this code is not found
    else {
        console.log("No Code Found!");
    };

    //check if params includes state
    // TODO Maybe delete, isn't really necessary to save it again
    if (urlParams.has("state")) {
        console.log("state: ");
        console.log(urlParams.get("state"));
        localStorage.setItem("current_state", urlParams.get("state"));
    }
    else {
        console.log("No State Found!");
    };


    // async error reporting
    function onError(error) {
        console.log(`Error: ${error}`);
    };

    // removes active tab
    function removeActive(tabInfo) {
        browser.tabs.remove(tabInfo[0].id);
    };

    // checks for code, then closes tab (how to make sure this fires at the right time?)
    if (localStorage.getItem("auth_code")) {
        // close MAL login window
        browser.tabs
        .query({active : true, currentWindow : true})
        .then(removeActive, onError);

        // send token request
        requestToken();
    };
};


/**
 * generates fetch request from MAL API, then saves response tokens
 * @returns {JSON Object} JSON string with params "token" and "timestamp"
 */
function requestToken() {
    fetch(config.token_endpoint, {
        method: "POST",
        body: new URLSearchParams({ 
            "client_id": config.client_id,
            "code": localStorage.getItem("auth_code"),
            "code_verifier": localStorage.getItem("code_challenge"),
            "grant_type": "authorization_code"
        })
    })
    .then(res => res.text())    // formats response to text first
    .then(res => {
        const tokens = JSON.parse(res);
        // create objects with token and timestamp to check for expiration later
        var access_token = {
            token: tokens.access_token, 
            timestamp: Date.now()
        }
        var refresh_token = {
            token: tokens.refresh_token, 
            timestamp: Date.now()
        }

        // save objects to localStorage, must be saved as string (hence stringify)
        localStorage.setItem("access_token", JSON.stringify(access_token));
        localStorage.setItem("refresh_token", JSON.stringify(refresh_token));

        // log saved object values (DELETE LATER)
        console.log("token: ", JSON.parse(localStorage.getItem("access_token")).token , "timestamp: ", JSON.parse(localStorage.getItem("access_token")).timestamp);
        console.log("token: ", JSON.parse(localStorage.getItem("refresh_token")).token , "timestamp: ", JSON.parse(localStorage.getItem("refresh_token")).timestamp);
    })
};


// wait until headers are recieved
// we will grab the URL with the code from the response headers 
browser.webRequest.onHeadersReceived.addListener(
    getURL,
    {urls: target}, // only target the MAL auth URL
    ["responseHeaders"]
    // ["blocking"] // Maybe block the request here?
);

// TODO: When do I remove the listener and this whole script?
// webRequest.onBeforeSendHeaders.removeListener(listener)
