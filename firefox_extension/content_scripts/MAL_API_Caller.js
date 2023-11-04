// TODO:
// handle get and post requests for MAL API v2

// functions for generating code verifier and challenge
function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2)
  }
    function generateRandomString() {
        var array = new Uint32Array(56/2);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec2hex).join('');
  }

/*
 * Create form to request access token from MAL's OAuth2 server.
 */
function oauthSignIn() {
    // OAuth2 endpoint for request access token
    var oauth2Endpoint = 'https://myanimelist.net/v1/oauth2/authorize';

    // Params for request
    var response_type = 'code';
    var client_id = 'f0d607de3f9a4b4302d360befdaacc38';
    var client_secret = 'a7e476a26603946f26553b1cbd0dbf53f4e898def49c3aa1076b009962423961';
    var code_verifier = generateRandomString();   // Equal because MAL only supports plain transformation method
    var code_challenge = code_verifier;
    var state = 'OauthTest';
  
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
  
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': client_id,
        'code_challenge': code_challenge,
        'response_type': response_type,
        'state': state
    };
  
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }
