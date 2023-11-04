// CREDIT: https://gist.github.com/ahmetgeymen/a9dcd656a1527f6c73d9c712ea2d9d7e#file-index-html

// Create and store a new PKCE code_verifier (the plaintext random secret)
var code_verifier = generateRandomString();
localStorage.setItem("pkce_code_verifier", code_verifier);

var code_challenge = code_verifier; // MAL only supports plain. Makes my life easier...

// Generate a secure random string using browser getRandomValues() and encoding to base64url
function generateRandomString() {
    var array = new Uint32Array(48);    // will be 128 characters long (64*2[2 chars used per array value with .substring()])
    window.crypto.getRandomValues(array);
    console.log(array);
    console.log(Array.from(array, dec => ('0' + dec.toString(26)))); // print raw strings
    return btoa(Array.from(array, dec => ('0' + dec.toString(26)).substring(dec.toString(26).length - 1)).join('')) // .toString(16) converts it to hexidecimal
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// function cryptoGenKey() {
//     let myKey = window.crypto.subtle.generateKey(
//         {
//             name: "AES-CBC",
//             length: "128",
//         },
//         true,
//         ["encrypt", "decrypt"],
//     );
//     console.log("key:", window.crypto.subtle.exportKey(raw, myKey));
// }

// function base64url_encode(buffer) {
//     return btoa(Array.from(new Uint8Array(buffer), b => String.fromCharCode(b)).join(''))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
// }

function runthedamnthing() {
    console.log("challenge:",code_challenge,"verifier :", code_verifier);
}
