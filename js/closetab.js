function logTabs(tabs) {
    let tab = tabs[0]; // Safe to assume there will only be one result
    console.log(tab.url);
}

browser.tabs.query({currentWindow: true, active: true}).then(logTabs, console.error)

 console.log(tab.includes("http://localhost/oauth"))

// let url = window.location.href;
