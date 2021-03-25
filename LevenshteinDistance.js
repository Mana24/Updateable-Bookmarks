"use strict";
// I COPIED THIS FROM THIS ARTICLE FROM WIKIPEDIA https://en.wikipedia.org/wiki/Levenshtein_distance#Iterative_with_two_matrix_rows
// I CAN'T DO LINEAR ALGEBRA FOR SHIT 
// I AM NOT EVEN SURE THIS HAS ANYTHING TO DO WITH LINEAR ALGEBRA
function LevenshteinDistance(s, t) {
    // create two work vectors of integer distances
    let m = s.length;
    let n = t.length;
    let v0 = [];
    let v1 = [];
    // initialize v0 (the previous row of distances)
    // this row is A[0][i]: edit distance for an empty s
    // the distance is just the number of characters to delete from t
    for (let i = 0; i < n + 1; i++) {
        v0[i] = i;
    }
    // for i from 0 to n:
    //     v0[i] = i
    for (let i = 0; i < m; i++) {
        // for i from 0 to m-1:
        // calculate v1 (current row distances) from the previous row v0
        // first element of v1 is A[i+1][0]
        //   edit distance is delete (i+1) chars from s to match empty t
        v1[0] = i + 1;
        // use formula to fill in th rest of the row
        for (let j = 0; j < n; j++) {
            // for j from 0 to n-1:
            // calculating costs for A[i+1][j+1]
            // deletionCost := v0[j + 1] + 1
            // insertionCost := v1[j] + 1
            let deletionCost = v0[j + 1] + 1;
            let insertionCost = v1[j] + 1;
            let substitutionCost;
            // if s[i] = t[j]:
            // 		substitutionCost := v0[j]
            // else:
            // 		substitutionCost := v0[j] + 1
            if (s[i] === t[j]) {
                substitutionCost = v0[j];
            }
            else {
                substitutionCost = v0[j] + 1;
            }
            v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
        }
        // copy v1 (current row) to v0 (previous row) for next iteration
        //swap v0 with v1
        let tempv0 = v0;
        v0 = v1;
        v1 = tempv0;
    }
    // after the last swap, the results of v1 are now in v0
    return v0[n];
}
