// //TODO:

// // clear show information from session storage when tab is closed (is that possible from content scripts?)


// // observer options
// const config = {attributes: true, childList: true, subtree: true };

// const target = document.querySelector('#content');

// const titleQuery = `document.querySelector(".show-title-link")`;
// const episodeQuery = `document.querySelector('.erc-current-media-info').getElementsByTagName("h1")` // also found under script json block as "episodeNumber"


// const observer = new MutationObserver((mutationList) => {
//     if (document.querySelector(".show-title-link") && document) {
//     }
// })


// function getShowInfo() {
//     var show = new Object();
//     show.title = getTitle();
//     show.episode = getEpisode();
//     console.log(show);
//     // disconnect observer
// }

// function getTitle() {
//     console.log("Getting Title...");
// }


// observer.observe(target, config)

// window.onload()



//TODO NEW METHOD!!!

// listen for GET request from:
// *://crunchyroll.com/content/v2/cms*
// should be json blob with episode name and number

function getAnimeInfo(response) {

}

const target = "*://crunchyroll.com/content/v2/cms/objects/*";

browser.webRequest.onCompleted.addListener(
    getAnimeInfo(),
    {urls: target}, // only target the MAL auth URL
    ["responseHeaders"]
    // ["blocking"] // Maybe block the request here?
);

// Im trying to read the response body, which can only be read from once ( https://www.reddit.com/r/sveltejs/comments/15up9co/how_can_i_intercept_and_modify_the_body_of_a/ )
// I'll need to create a clone of it and submit that to the site, along with original headers (?) may not be needed if just reading
