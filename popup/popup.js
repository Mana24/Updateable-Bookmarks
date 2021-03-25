"use strict";
// Getting elements from the dom
const BookmarkSelection = document.getElementById("BookmarkSelection");
const FaviconDisplay = document.getElementById("WebsiteFavicon");
const UpdateButton = document.getElementById("UpdateButton");
const MessageToUserLabel = document.getElementById("MessageToUserLabel");
const UpdateTitleCheckbox = document.getElementById("UpdateTitleCheckbox");
const SettingsIcon = document.getElementById("SettingsIcon");
// Adding our event listenrs
UpdateButton.addEventListener("click", UpdateBookmark);
SettingsIcon.addEventListener("click", GoToOptions);
document.addEventListener("keypress", DetectCTRLZ);
// Making a previousbookmark variable for the undo feautre to work
let previousBookmark = null;
chrome.storage.sync.get(["Options"], (items) => {
    // getting the options from storage keeping in mind that it could be undefined
    let options = items.Options;
    if (options) {
        UpdateTitleCheckbox.checked = options.UpdateTitle;
    }
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, (tabs) => {
        // Get tab Favicon to and put it in the popup field set..
        //console.log(tabs);
        FaviconDisplay.src = tabs[0].favIconUrl;
        // Populate selection field with the name of the bookmarks the same website as this tab
        // Look for that kind of bookmark
        const regex = /:\/\/\S*?\/|:\/\/\S*/g;
        const tabURL = tabs[0].url;
        chrome.bookmarks.search(regex.exec(tabURL)[0], (results) => {
            // Handle the edge case where there are no bookmarks that belong the site of the current tab
            if (results.length === 0) {
                BookmarkSelection.add(new Option("---No Bookmarks Here---"));
                BookmarkSelection.disabled = true;
                UpdateButton.disabled = true;
            }
            // choose a sorting method of the displyed bookmarks based on options
            let sorter;
            if (options) {
                //console.log("Found sorter in options",SortingMethods[options.SortingMethod]);
                switch (options.SortingMethod) {
                    case SortingMethods.AlphapeticalOrder:
                        sorter = AlphapeticalSorter;
                        break;
                    case SortingMethods.DateAdded:
                        sorter = DateAddedSorter;
                        break;
                    case SortingMethods.LevenshteinDistanceTitles:
                        sorter = LevenshteinDistanceTitlesSorter(tabs[0]);
                        break;
                    default:
                    case SortingMethods.LevenshteinDistanceUrls:
                        sorter = LevenshteinDistanceURLSorter(tabs[0]);
                        break;
                }
            }
            else {
                sorter = LevenshteinDistanceURLSorter(tabs[0]);
            }
            results.sort(sorter);
            // Add all the bookmark names that I found and sorted to the bookmark selector
            // with their value being the bookmark ID
            for (let bookmark of results) {
                let option = new Option(bookmark.title, bookmark.id);
                BookmarkSelection.add(option);
            }
        });
    });
});
function UpdateBookmark() {
    const SelectedOption = BookmarkSelection.selectedOptions[0];
    const BookmarkToUpdateID = SelectedOption.value;
    // Update Previous Bookmark
    chrome.bookmarks.get(BookmarkToUpdateID, results => {
        previousBookmark = results[0];
    });
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, (tabs) => {
        // Making an object with the updates that I am going to apply to the selected bookmark
        let NewTitleAndUrl = {
            url: tabs[0].url
        };
        if (UpdateTitleCheckbox.checked) {
            NewTitleAndUrl.title = tabs[0].title;
        }
        // Actually do the updating
        chrome.bookmarks.update(BookmarkToUpdateID, NewTitleAndUrl, (result) => {
            // Make the popup say: DONE! Then fade awaaaaay in 2 seconds
            DisplayMessageToUser("DONE!", "indigo", "lawngreen");
            FadeOut(MessageToUserLabel, 2000, 33);
            // Change the text on the selected option
            SelectedOption.text = result.title;
        });
    });
}
function GoToOptions() {
    chrome.runtime.openOptionsPage();
}
/**
 * Trys to start the fading animation of this element
 * @param fadingParagraph The element to fade.
 * @param fadingDuration The duration of the fading animation in milliseconds
 * @param frameLength The lenght of each frame of the animation
 * @returns Returns false if it didn't start fading. Returns true if it starts fading
 */
function FadeOut(fadingParagraph, fadingDuration, frameLength = 30) {
    if (fadingParagraph === null)
        throw "fadingParagraph can't be null";
    if (fadingParagraph.isFading === true)
        return false;
    fadingParagraph.isFading = true;
    const intervalID = setInterval(() => {
        const opacityValue = parseFloat(fadingParagraph.style.opacity);
        if (opacityValue > 0) {
            // math to reduce opacity based on framelength and fading duration
            const newOpacity = opacityValue - (frameLength / fadingDuration);
            fadingParagraph.style.opacity = newOpacity.toString();
        }
        else {
            // Oh we reached 0! Better stop this repetion and tell the world that we're not fading any more
            clearInterval(intervalID);
            fadingParagraph.isFading = false;
        }
    }, frameLength);
    return true;
}
/**
 * Displays a message to the user. You might want to make the element fade after displaying the message
 * @param message The message to put on the label
 * @param backgroundColor The background color to put onto the style of the label
 * @param textColor the color of the message
 * @param setOpacityTo sets the opacity of the label to this value
 */
function DisplayMessageToUser(message, backgroundColor, textColor, setOpacityTo = 1) {
    MessageToUserLabel.textContent = message;
    MessageToUserLabel.style.backgroundColor = backgroundColor;
    MessageToUserLabel.style.color = textColor;
    MessageToUserLabel.style.opacity = setOpacityTo.toString();
}
function DetectCTRLZ(ev) {
    if (ev.code === "KeyZ" && ev.ctrlKey) {
        Undo();
    }
}
function Undo() {
    // null handling
    if (previousBookmark === null)
        return;
    // Get the selected option to update that as well
    const SelectedOption = BookmarkSelection.selectedOptions[0];
    // what are the changes that we want to make to the bookmark whose id we have
    const changes = {
        title: previousBookmark.title,
    };
    if (previousBookmark.url)
        changes.url = previousBookmark.url;
    chrome.bookmarks.update(previousBookmark.id, changes, results => {
        // Change the text on the selected option
        SelectedOption.text = previousBookmark.title;
        // Display message to the user telling them that we undid what they had done.
        DisplayMessageToUser("UNDO!", "red", "black");
        FadeOut(MessageToUserLabel, 2000);
    });
}
