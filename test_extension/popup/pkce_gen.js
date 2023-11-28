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
 * Generate a secure random string using browser getRandomValues() and encoding to base64url.
 * @param {int}        stringLength preferred string length. ( Only multiples of 8 will give exact length expected (16,32,64,128) ).
 * @returns {string}                string with stringLength # of characters " A-Z, a-z, 0-9, -_ ".
 */
export function generateRandomString(stringLength) {
    stringLength = Math.floor((stringLength/(8/6)));    // convert input length to correct base64 length, always rounds down when necessary
    var array = new Uint32Array(stringLength);
    window.crypto.getRandomValues(array);               // 128 characters (96 bytes for generation, input into base64 (6-bits per char) [8bits\6bits]*96bytes=128 chars)
    return base64urlencode(array);   // base64urlencode takes an array as input, reads numbers to their own 
};
