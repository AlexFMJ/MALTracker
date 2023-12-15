function reader(details) {
    // set listener for request data
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decode = new TextDecoder("utf-8");
    const encode = new TextEncoder();

    //TODO double check that all data is streamed in before JSON parse

    // read request data
    filter.ondata = (event) => {
        // decode request data
        let str = (decode.decode(event.data));
        // convert data to JSON
        console.log(str);
        let obj = JSON.parse(str);

        // get only the current episode data
        // TODO Error detaection and handling
        let episode = obj.data[0].episode_metadata;

        // save show info to session storage (change later maybe?)
        sessionStorage.setItem("current_show_title", episode.series_title)
        sessionStorage.setItem("current_show_episode", episode.episode_number)
        
        // logging info about episode
        console.log("INFO STR BELOW:");
        console.log("Show: ", sessionStorage.getItem("current_show_title"));
        console.log("Episode: ", sessionStorage.getItem("current_show_episode"));

        // send response to browser, ending block
        filter.write(encode.encode(str));
    };

    // remove listener
    filter.onstop = (event) => {
        filter.close();
    }
}

// listens for requests sent to the CMS/objects url, used for fetching episode details
browser.webRequest.onBeforeRequest.addListener(
    reader,
    { urls: ["*://www.crunchyroll.com/content/v2/cms/objects/*"] },
    ["blocking"]        // needed to intercept request body (must be retunred after reading)
);