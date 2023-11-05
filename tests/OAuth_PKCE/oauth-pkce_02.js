/**
 * CREDIT:
 * https://gist.github.com/ahmetgeymen/a9dcd656a1527f6c73d9c712ea2d9d7e#file-index-html
 * https://thewoods.blog/base64url/
 */

// Create and store a new PKCE code_verifier (the plaintext random secret)
var code_verifier = generateRandomString(128);

////////// CHANGE THIS TO STORAGE FOR USE IN EXTENSION //////////////
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
localStorage.setItem("local_code_verifier", code_verifier);

var code_challenge = code_verifier; // MAL only supports plain. Makes my life easier...


// Create and store current state
var state = generateRandomString(16);
localStorage.setItem("local_current_state", state);

// refreshes state when requested
function getstate() {
    state = generateRandomString(16);
    localStorage.setItem("local_current_state", state);
    console.log("new state:",state)
}


// Combine all data for MAL API into one dict.
var config = {
    client_id: "92b69132bb2ffad84cccada01aef0d18",
    redirect_uri: "file:///F:/Coding/Personal/MALTracker/tests/OAuth_PKCE/test.html",
    authorization_endpoint: "https://myanimelist.net/v1/oauth2/authorize",
    token_endpoint: "https://myanimelist.net/v1/oauth2/token"
};


// sanity check, log the code challenge and verifier
console.log("challenge:",code_challenge,"verifier :", code_verifier);


// Base64-urlencodes the input string
function base64urlencode(str) {
    // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    //   (replace + with -, replace / with _, trim trailing =)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


/** 
 * Generate a secure random string using browser getRandomValues() and encoding to base64url
 * Input: x preferred string length. ( Only multiples of 8 will give exact length expected (16,32,64,128) )
 * Output: y # of characters A-Z, a-z, 0-9, -_
*/
function generateRandomString(stringLength) {
    stringLength = Math.floor((stringLength/(8/6)));    // convert input length to correct base64 length, always rounds down when necessary
    var array = new Uint32Array(stringLength);
    window.crypto.getRandomValues(array);               // 128 characters (96 bytes for generation, input into base64 (6-bits per char) [8bits\6bits]*96bytes=128 chars)
    return base64urlencode(array);   // base64urlencode takes an array as input, reads numbers to their own 
};

// Build the authorization URL
var url = config.authorization_endpoint 
    + "?response_type=code"
    + "&client_id="+encodeURIComponent(config.client_id)
    + "&code_challenge="+encodeURIComponent(code_challenge)
    + "&state="+encodeURIComponent(state)
    // + "&redirect_uri="+encodeURIComponent(config.redirect_uri)
    ;

console.log("URL:", url);

function runthedamnthing() {
    console.log("Current state:", localStorage.local_current_state);
    getstate();
    // console.log(generateRandomString(32))
};


function verifierCheck() {
    console.log(localStorage.getItem("local_code_verifier"));
};


function tokenCheck() {
    // TODO
};


function getRequest() {
    window.location = url;
    // TODO change this to open a new tab, to keep session going(?)
};



/** TODO:
 * Find a way to get the OAuth2 token back after the request.
 * Save the token even after the window closes, then check for the token on page load.
 * Refresh the token automatically
 * 
 * Look into: https://www.ietf.org/archive/id/draft-ietf-oauth-browser-based-apps-15.html#token-storage
 * it mentions "Architecture where the JavaScript code is the OAuth client itself and does not have
 * a corresponding backend component"
 */

