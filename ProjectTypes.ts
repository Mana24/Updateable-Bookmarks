interface ExtensionOptions {
    UpdateTitle: boolean;
    SortingMethod: SortingMethods;
}

interface MessageToUser {
    Style:CSSStyleDeclaration;
    Text:string;
}

// interface PreviousBookmark {
//     id:string;
//     title:string;
//     url:string;
// }

interface HTMLFadingParagraphElement extends HTMLParagraphElement {
    isFading:boolean|undefined;
}
    
enum SortingMethods {
    LevenshteinDistanceUrls = 0,
    LevenshteinDistanceTitles = 1,
    DateAdded = 2,
    AlphapeticalOrder = 3
}