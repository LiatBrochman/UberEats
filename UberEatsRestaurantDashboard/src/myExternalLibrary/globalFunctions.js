

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
