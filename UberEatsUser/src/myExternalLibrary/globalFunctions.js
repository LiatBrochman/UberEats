export function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return true;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return true;
        }
    }

    return false;
}