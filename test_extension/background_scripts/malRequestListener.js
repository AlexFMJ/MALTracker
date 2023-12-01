/**
 * Reads and parses url sent from MAL to localhost:5500
 * Saves code and state params to session storage
 */

const config = {
    client_id: "92b69132bb2ffad84cccada01aef0d18",
    redirect_uri: "http://localhost:8080/tests/OAuth_PKCE/test.html",
    authorization_endpoint: "https://myanimelist.net/v1/oauth2/authorize",
    token_endpoint: "https://myanimelist.net/v1/oauth2/token"
};


console.log("loaded!");


// target url requested by MAL after pressing agree on authentication dialogue
const target = ['*://myanimelist.net/submission/authorization'];

// the index for the location header when the auth POST request is given
// if this proves an issue later, make a function that searches for the location key instead
const location_index = 1;


/**
 * Parses the url value from getURL, then saves code and state to session
 * @param {string} authURL 
 */
function parseCode(authURL) {
    // prepare query string for URLSearchParams by removing everything before "?"
    const authParams = authURL.substring(authURL.indexOf("?"));

    // call URLSearchParams to make objects from any params contained in the url
    const urlParams = new URLSearchParams(authParams);


    // check if params includes code, then submit and whatnot
    if (urlParams.has("code")) {
        console.log("code: ");
        console.log(urlParams.get("code"));
        localStorage.setItem("auth_code", urlParams.get("code"));
    }
    else {
        console.log("No Code Found!");
    };


    if (urlParams.has("state")) {
        console.log("state: ");
        console.log(urlParams.get("state"));
        localStorage.setItem("current_state", urlParams.get("state"));
    }
    else {
        console.log("No State Found!");
    };

    // removes active tab
    function removeActive(tabInfo) {
        browser.tabs.remove(tabInfo[0].id);
    }
    // async error reporting
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    // checks for current state and code, then closes tab
    if (localStorage.getItem("current_state") && localStorage.getItem("auth_code")) {
        // close MAL login window
        browser.tabs
        .query({active : true, currentWindow : true})
        .then(removeActive, onError);

        // send post request
        requestToken();
    }
};


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
    .then(res => res.text())
    .then(res => {
        const tokens = JSON.parse(res);
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        console.log("token: ", localStorage.getItem("access_token"));
        console.log("refresh: ", localStorage.getItem("refresh_token"));
    });
}


/**
 * Listener for browser.webRequest.onHeadersRecieved
 * @param {object} details 
 */
function getURL(details) {
    // TODO: Close Tab
    
    // Location_index should always be the same from responseHeaders, 
    // Result: string containing redirect URL requested by MAL to localhost
    const authURL = details.responseHeaders[location_index].value;

    parseCode(authURL);
    // TODO Block request and close window
};


// wait until headers are recieved
// we will grab the URL with the code from the response headers 
browser.webRequest.onHeadersReceived.addListener(
    getURL,
    {urls: target},
    ["responseHeaders"]
    // ["blocking"] // Maybe block the request here?
);

// TODO: When do I remove the listener and this whole script?
// webRequest.onBeforeSendHeaders.removeListener(listener)
