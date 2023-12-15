function reader(details) {
    // set listener for request data
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decode = new TextDecoder("utf-8");
    const encode = new TextEncoder();

    // create array to store all blobs
    const data = [];
    
    
    // read request data
    filter.ondata = (event) => {
        data.push(event.data);
    };

    // wait for end of response
    filter.onstop = async (event) => {
        // create a blob from the data stored from each event
        const blob = new Blob(data, {type: "text/html"});
        // create arraybuffer from all data blobs
        const buffer = await blob.arrayBuffer();

        // parse the data and return an object containing only episode info
        let str = decode.decode(buffer);
        let obj = JSON.parse(str)
        let anime = obj.data[0].episode_metadata;

        // save episode info to session storage
        // TODO add season information to title or as another key:object pair
        var show = {
            episode_no: anime.episode_number,
            title: anime.series_title
        }
        sessionStorage.setItem("current_show", JSON.stringify(show))
        
        console.log(
            JSON.parse(sessionStorage.getItem("current_show"))
            );
        filter.write(encode.encode(str))
        filter.close();
    }
}

// listens for requests sent to the CMS/objects url, used for fetching episode details
browser.webRequest.onBeforeRequest.addListener(
    reader,
    { urls: ["*://www.crunchyroll.com/content/v2/cms/objects/*"] },
    ["blocking"]        // needed to intercept request body (must be retunred after reading)
);