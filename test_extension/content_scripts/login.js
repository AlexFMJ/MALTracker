/** 
 * Generates a code challenge and state for the request
 * then builds and opens request link in new tab
 */
function loginMAL() {
    // Create and store a new PKCE code_verifier (the plaintext random secret)
    // TODO CHECK FOR VERIFIER IN STORAGE FIRST
    var code_verifier = generateRandomString(128);
    var code_challenge = code_verifier; // MAL only supports plain. Makes my life easier...
    localStorage.setItem("code_challenge", code_challenge)


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
