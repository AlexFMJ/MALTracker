function createShow() {
    var show = new Object();
    show.title = getTitle();
    console.log(show.title);
}

function getTitle() {
    // TODO: title is slow to load, need to use mutation observer
    console.log("Getting title...")
    let title = document.getElementsByClassName("show-title-link")[0];
    console.log(title.text)
    sessionStorage.setItem("show_title", title.text)
    return title.text;

    // CURRENT TODO:
    //  how to save title globally, and delete it from storage when tab is closed?
    //      ideas:
    //          listen for tab close
    //          timeout
    //          is there an onclose() function?
}

//TODO:

// clear show information from session storage when tab is closed (is that possible from content scripts?)


window.onload(createShow());

