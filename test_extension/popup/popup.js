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

/** 
 * Base64-urlencodes the uint32array, then returns a string.
 * @param {Uint32Array} str Accepts Uint32Array as input
 */
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
 * Listen for button clicks
 * CHANGE THIS LATER AS NEEDED FOR MORE BUTTONS
 */
function buttonListener() {
    document.addEventListener("click", (event) => {
        
        if (event.target.id === "login") {
            // Ignore non-login click
            console.log("Button Clicked");
            loginMAL()
        }
        else if(event.target.id === "printCode") {
            // echoes currently saved code hopefully
            console.log(localStorage.getItem("auth_code"));
        }
        else if(event.target.id === "listAdd") {
            requestHandler();
        }
        else {
            return;
        }
    })
};


/** 
 * check for access token, login or refresh if not found
 */
function checkToken() {
    // if a token is not found, reauthorize and login
    if (localStorage.getItem("access_token") == null || !JSON.parse(localStorage.getItem("access_token")).token) {
            // TODO: add message telling user to sign in
            console.log("token not found")
            loginMAL();
            return;
    };

    const month = 2419200000 // 28 days in miliseconds (epoch time)

    // calculate time elapsed since last refresh
    var timeElapsed = Date.now() - JSON.parse(localStorage.getItem("refresh_token")).timestamp;
    console.log("time:", timeElapsed);

    // if a month has passed since last refresh, reauthorize and login
    if (timeElapsed > month) {
        console.log("longer than a month has passed, login again")
        loginMAL();
        return;
    }
    // otherwise, only the original token should've timed out, so send refresh token
    else {
        console.log("submitting refresh token.")
        refreshToken();
        return;
    };
};


/**
 * Generate a secure random string using browser getRandomValues() and encoding to base64url.
 * @param {int}        stringLength preferred string length. ( Only multiples of 8 will give exact length expected (16,32,64,128) ).
 * @returns {string}                string with stringLength # of characters " A-Z, a-z, 0-9, -_ ".
 */
function generateRandomString(stringLength) {
    stringLength = Math.floor((stringLength/(8/6)));    // convert input length to correct base64 length, always rounds down when necessary
    var array = new Uint32Array(stringLength);
    window.crypto.getRandomValues(array);               // 128 characters (96 bytes for generation, input into base64 (6-bits per char) [8bits\6bits]*96bytes=128 chars)
    return base64urlencode(array);   // base64urlencode takes an array as input, reads numbers to their own 
};


/**
 * List the anime listed in the MAL query response, including titles and images
 * @param {object}  apiResponse response given from the MAL anime query request
 */
function listAnime(apiResponse) {
    // we'll be dialing this a lot, so make it short
    var resData = apiResponse.data;

    for (anime in resData) {
        console.log(resData[anime]);

        var thisAnime = resData[anime].node;

        //create element
        const newDiv = document.createElement("div");
        const title = document.createTextNode(thisAnime.title);
        newDiv.appendChild(title);
        const currentDiv = document.getElementById("MALInfo");
        document.body.appendChild(newDiv, currentDiv)

            // anime.node.title
            // anime.node.main_picture.medium
    }
    // TODO:
    // Save this list until a new api request is made or something else changes
}


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


/**
 * Generates a new access token using previously saved refresh token
 * if refresh token has expired, reprompts user to login again
 */
function refreshToken() {
    fetch(config.token_endpoint, {
        method: "POST",
        body: new URLSearchParams({ 
            "client_id": config.client_id,
            "grant_type": "authorization_code",
            "refresh_token": JSON.parse(localStorage.getItem("refresh_token")).token
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
        console.log("updated token: ", JSON.parse(localStorage.getItem("access_token")).token , "timestamp: ", JSON.parse(localStorage.getItem("access_token")).timestamp);
        console.log("updated refresh token: ", JSON.parse(localStorage.getItem("refresh_token")).token , "timestamp: ", JSON.parse(localStorage.getItem("refresh_token")).timestamp);
    })
};


/**
 * Sends requests to read or update from MAL
 * TODO: change depend on POST or GET request and all that
 */
function requestHandler() {
    // Build the authorization URL
    var url = "https://api.myanimelist.net/v2/"
    + "anime"                                   // type of content, normally anime
    + "?q="+encodeURIComponent("Cowboy Bebop")  // search query
    + "&limit="+encodeURIComponent("4")         // response limit
    ;

    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem("access_token")).token
        }
    })
    .then((res) => {
        console.log("response.status = ", res.status);
        if (res.status === 200) {
            console.log("good!")
            return res.text();
        }
        else {
            // get error code (401 unauthorized?) and resend refresh token
            console.log("ERROR")
            checkToken();
        }
    })
    .then(res => {
        const MALResponse = JSON.parse(res);
        console.log(MALResponse);
        listAnime(MALResponse);
    })
};


// show login button if no token is currently saved to localStorage
// TODO: or if api requests fail
function showLogin() {
    if (!localStorage.getItem("access_token")) {
        document.querySelector("#login").classList.remove("hidden");
    };
};


window.onload = (load) => {
    console.log("Popup Opened")
    buttonListener();
    showLogin();
};
