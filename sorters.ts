/**
 * sorts the input based on when they were created (in descending order of the epoch date of their creation)
 */
function DateAddedSorter (a:chrome.bookmarks.BookmarkTreeNode, b:chrome.bookmarks.BookmarkTreeNode):number {
	return <number>a.dateAdded - <number>b.dateAdded;
}

/** Gets the Levenshtein Distance Function that takes two bookmark nodes's titles and compares
 * their distance from the provided tab's title (ascending order)
 */
function LevenshteinDistanceTitlesSorter(tab:chrome.tabs.Tab):(a:chrome.bookmarks.BookmarkTreeNode, b:chrome.bookmarks.BookmarkTreeNode) => number {
	return (a:chrome.bookmarks.BookmarkTreeNode,b:chrome.bookmarks.BookmarkTreeNode) => 
		LevenshteinDistance(a.title, <string>tab.title)-
		LevenshteinDistance(b.title, <string>tab.title);
}


/** Gets the Levenshtein Distance Function that takes two bookmark nodes' urls and compares
 * their distance from the provided tab's url (ascending order)
 */
function LevenshteinDistanceURLSorter(tab:chrome.tabs.Tab):(a:chrome.bookmarks.BookmarkTreeNode, b:chrome.bookmarks.BookmarkTreeNode) => number {
	return (a:chrome.bookmarks.BookmarkTreeNode,b:chrome.bookmarks.BookmarkTreeNode) => 
		LevenshteinDistance(<string>a.url, <string>tab.url)-
		LevenshteinDistance(<string>b.url, <string>tab.url);
}

/**
 * Sorts the bookmarks in alphapetical order
 */
function AlphapeticalSorter (a:chrome.bookmarks.BookmarkTreeNode, b:chrome.bookmarks.BookmarkTreeNode):number {
    let textA:string = a.title.toUpperCase();
    let textB:string = b.title.toUpperCase();
    
    return textA.localeCompare(textB);
}