function handleMessage(request, sender, sendResponse) {
    if (request == "getShow") {
        console.log("getting show")
        return Promise.resolve(sessionStorage.getItem("current_show"));
    }
};

browser.runtime.onMessage.addListener(handleMessage);