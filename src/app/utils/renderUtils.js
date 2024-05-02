function findEntryPoint(jsonData) {
    //find "application" in json
    const application = jsonData['application'];
    console.log("find entry point function: application")
    console.log(application);
    if (!application || !application.elements) {
        console.error('Application element not found or does not contain child elements.');
        return null;
    }


    //first child of application is supposed to be entry point??? (discuss)
    const childKeys = Object.keys(application.elements);
    if (childKeys.length === 0) {
        console.error('Application element does not contain any child elements.');
        return null;
    }

    return childKeys[0];
}

export { findEntryPoint };
