// import { generateRandomString } from "./pkce_gen.js";

// Combine all data for MAL API into one dict.
const config = {
    client_id: "92b69132bb2ffad84cccada01aef0d18",
    redirect_uri: "http://localhost:8080/tests/OAuth_PKCE/test.html",
    authorization_endpoint: "https://myanimelist.net/v1/oauth2/authorize",
    token_endpoint: "https://myanimelist.net/v1/oauth2/token"
};

/**
 * CREDIT:
 * https://gist.github.com/ahmetgeymen/a9dcd656a1527f6c73d9c712ea2d9d7e#file-index-html
 * https://thewoods.blog/base64url/
 */

/** Base64-urlencodes the input string. */
function base64urlencode(str) {
    /** 
     * Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
     * btoa accepts chars only within ascii 0-255 and base64 encodes them.
     * Then convert the base64 encoded to base64url encoded
     * (replace + with -, replace / with _, trim trailing =) 
     */
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


/** 
 * Generate a secure random string using browser getRandomValues() and encoding to base64url.
 * Input: x preferred string length. ( Only multiples of 8 will give exact length expected (16,32,64,128) )
 * Output: y # of characters A-Z, a-z, 0-9, -_
 */
function generateRandomString(stringLength) {
    stringLength = Math.floor((stringLength/(8/6)));    // convert input length to correct base64 length, always rounds down when necessary
    var array = new Uint32Array(stringLength);
    window.crypto.getRandomValues(array);               // 128 characters (96 bytes for generation, input into base64 (6-bits per char) [8bits\6bits]*96bytes=128 chars)
    return base64urlencode(array);   // base64urlencode takes an array as input, reads numbers to their own 
};


/** 
 * Generates a code challenge and state for the request
 * then builds and opens request link in new tab
 */
function loginMAL() {
    // Create and store a new PKCE code_verifier (the plaintext random secret)
    // TODO CHECK FOR VERIFIER IN STORAGE FIRST
    var code_verifier = generateRandomString(128);
    var code_challenge = code_verifier; // MAL only supports plain. Makes my life easier...
    localStorage.setItem("code_challenge", code_challenge);


    // Create and store current state
    var state = generateRandomString(16);
    localStorage.setItem("current_state", state);

    // Sanity check for saved state and challenge
    console.log("Current state:", localStorage.current_state, "Code_challenge:", localStorage.code_challenge);

    
    // Build the authorization URL
    var url = config.authorization_endpoint 
    + "?response_type=code"
    + "&client_id="+encodeURIComponent(config.client_id)
    + "&code_challenge="+encodeURIComponent(code_challenge)
    + "&state="+encodeURIComponent(state)
    //+ "&redirect_uri="+encodeURIComponent(config.redirect_uri)
    ;
    window.open(url, '_blank');
};

// either keep as function, or create during async function to API
function generateTokenLink() {
    // Build the token URL to be sent as a POST request
    token_url = config.token_endpoint 
        + "&client_id="+encodeURIComponent(config.client_id)
        + "?code="+encodeURIComponent(localStorage.getItem("authorization_response"))
        + "&code_verifier="+encodeURIComponent(code_challenge)
        + "&grant_type=authorization_code"
        //+ "&redirect_uri="+encodeURIComponent(config.redirect_uri)
        ;

    console.log(token_url);
};


// saves the input authcode for use in the token exchange step later
function saveAuthCode() {
    var auth_response = document.getElementById('authResponse').value;
    localStorage.setItem("authorization_response", auth_response);
    console.log("Saved:", localStorage.getItem("authorization_response")); 
        
    fetch(config.token_endpoint, {
        method: "POST",
        body: new URLSearchParams({ 
            "client_id": config.client_id,
            "code": auth_response,
            "code_verifier": localStorage.getItem("local_code_verifier"),
            "grant_type": "authorization_code"
        })
    })
    .then(res => res.text())
    .then(res => {
        console.log(res)
    });

};


/**
 * Listen for button clicks
 * CHANGE THIS LATER AS NEEDED FOR MORE BUTTONS
 */
function buttonListener() {
    document.addEventListener("click", (event) => {
        
        if (event.target.id === "login") {
            // Ignore non-login click
            console.log("Button Clicked");
            loginMAL();
        }
        else if(event.target.id === "printCode") {
            // echoes currently saved code hopefully
            console.log(localStorage.getItem("auth_code"));
        }
        else {
            return;
        }
    });
};

window.onload = (load) => {
    console.log("Popup Opened")
    buttonListener();
};
