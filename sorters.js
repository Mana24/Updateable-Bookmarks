"use strict";
/**
 * sorts the input based on when they were created (in descending order of the epoch date of their creation)
 */
function DateAddedSorter(a, b) {
    return a.dateAdded - b.dateAdded;
}
/** Gets the Levenshtein Distance Function that takes two bookmark nodes's titles and compares
 * their distance from the provided tab's title (ascending order)
 */
function LevenshteinDistanceTitlesSorter(tab) {
    return (a, b) => LevenshteinDistance(a.title, tab.title) -
        LevenshteinDistance(b.title, tab.title);
}
/** Gets the Levenshtein Distance Function that takes two bookmark nodes' urls and compares
 * their distance from the provided tab's url (ascending order)
 */
function LevenshteinDistanceURLSorter(tab) {
    return (a, b) => LevenshteinDistance(a.url, tab.url) -
        LevenshteinDistance(b.url, tab.url);
}
/**
 * Sorts the bookmarks in alphapetical order
 */
function AlphapeticalSorter(a, b) {
    let textA = a.title.toUpperCase();
    let textB = b.title.toUpperCase();
    return textA.localeCompare(textB);
}
