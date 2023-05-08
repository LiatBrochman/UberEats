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

export function cleanUp() {

    //un-subscribe from all
    for (const key in subscription) {
        // Check if the current object value has an "unsubscribe" method
        if (typeof subscription[key].unsubscribe === 'function') {
            // Call the "unsubscribe" method
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ unsubscribing from ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription[key], null, 4))
            subscription[key].unsubscribe()
        }
    }
}

export async function executeFunctionsSequentially(functions) {
    const results = [];

    for (const func of functions) {
        try {
            const returnValue = func();
            const res = returnValue instanceof Promise ? await returnValue : returnValue;
            results.push({status: 'fulfilled', value: res});
        } catch (error) {
            results.push({status: 'rejected', reason: error});
            break; // Stop the process if a function is rejected
        }
    }

    return results;
}
