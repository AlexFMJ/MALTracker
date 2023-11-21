// intercept and cancel event request before it is sent
// save data to session
webRequest.onBeforeSendHeaders.addListener(
    listener,
    filter, 
    extraInfoSpec
)
webRequest.onBeforeSendHeaders.removeListener(listener)
