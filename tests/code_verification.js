// functions for generating code verifier and challenge
// globalThis.genRandomNumbers = () => {
//     const array = new Uint32Array(10);
//     crypto.getRandomValues(array);
  
//     const randText = document.getElementById("myRandText");
//     randText.textContent = `The random numbers are: ${array.join(" ")}`;
//   };

// functions for generating code verifier and challenge
function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2)
  }
    function generateRandomString() {
        var array = new Uint32Array(56/2);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec2hex).join('');
  }

  var test = generateRandomString()
  console.log(test)
