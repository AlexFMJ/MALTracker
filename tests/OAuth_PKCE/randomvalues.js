function runthedamnthing() {
    const array = new Uint32Array(10);
    self.crypto.getRandomValues(array);
    
    console.log("Your lucky numbers:");
    for (const num of array) {
    console.log(num);
    }
}
