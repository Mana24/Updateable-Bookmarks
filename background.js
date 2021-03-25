chrome.tabs.onCreated.addListener(GotTab);
chrome.tabs.onUpdated.addListener((tabid, changes, tab) => GotTab(tab));

function IsFileOrHttp(url) 
{
    url = url.toLowerCase()
    if(url.startsWith("file") || url.startsWith("http")) {
        return true;
    } else {
        return false;
    }
}

function GotTab(tab) {
    //console.log(tab)
    if (!IsFileOrHttp(tab.url))
        chrome.browserAction.disable(tab.id);
}