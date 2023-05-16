export function cleanUp() {

    //un-subscribe from all
    for (const key in window.subscription) {
        // Check if the current object value has an "unsubscribe" method
        if (typeof window.subscription[key].unsubscribe === 'function') {
            // Call the "unsubscribe" method
            window.subscription[key].unsubscribe()
        }
    }
    return true
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
