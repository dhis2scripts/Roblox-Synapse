// closes the iframe when use saves or cancels
window.returntoreview = function (values) {
    Object.keys(values).forEach((key) => {
        var el = document.querySelector(`#YXed7PnLRco-${key}-val input,#YXed7PnLRco-${key}-val select`);
        if (!!el) el.value = values[key];
    });
};
// closes the iframe when use saves or cancels
window.closeIframe = function () {
    document.body.removeChild(ifrm);
};

function objectToQueryString(obj) {
    const params = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Encode both the key and value to ensure proper URL encoding
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(obj[key]);
            params.push(`${encodedKey}=${encodedValue}`);
        }
    }

    return params.join('&');
}

var ifrm;
var useIframe = false;
// Function to open the popup window
function openIcdPopup(olsdata) {
    if (useIframe) {
        var urlparts = window.location.pathname.split("/");
        var indexidx = urlparts.findIndex((p) => p === "index.html");
        var baseurl = window.location.origin + urlparts.slice(0, indexidx - 1).join("/");
        console.log("go to mccod");


        console.log("olsdata", olsdata);
        //add iframe data to local storage for prefilling the form
        localStorage.setItem("mcodtemp", JSON.stringify(olsdata));

        //prepare the Iframe
        ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", baseurl + "/api/apps/Medical-Certificate-of-Cause-of-Death/index.html");
        ifrm.style.width = "calc(100% - 40px)";
        ifrm.style.minHeight = "640px";
        ifrm.style.position = "absolute";
        ifrm.style.top = "10px";
        ifrm.style.left = "20px";
        ifrm.style.border = "1px solid black";
        ifrm.style.boxShadow = "2px 4px 12px 9px rgba(0,0,0,0.4)";

        console.log("iff", ifrm);
        // display the iframe
        document.body.appendChild(ifrm);

        ifrm.onload = function () {
            // remove dhis2 header
            var iframeDocument = ifrm.contentDocument || ifrm.contentWindow.document;
            var headerElement = iframeDocument.getElementById("root").querySelector("header");
            headerElement.style.display = "none";
        };
    }else {
        //generate url query params
        const urlQueryParams = objectToQueryString(olsdata);
        const targetBaseUrl = "https://ug.sk-engine.cloud/hmis"
        const appUrl = `${targetBaseUrl}/api/apps/Medical-Certificate-of-Cause-of-Death/index.html`
        const targetSystemUrl = `${appUrl}?${urlQueryParams}`
        const popupName = 'Medical-Certificate-of-Cause-of-Death'; // Optional - specify a name for the popup window
        const width = 1000; // Optional - specify the width of the popup window
        const height = 640; // Optional - specify the height of the popup window
        // Open the popup window
        const popup = window.open(targetSystemUrl, popupName, `width=${width}, height=${height}`);
        if (popup) {
            // The popup was successfully opened
            // You can perform further actions or manipulate the popup here
        } else {
            // The popup was blocked by the browser or there was an error
            // You may want to inform the user or handle this case gracefully
            console.log('Popup was blocked or an error occurred.');
        }
    }
}


//code added to line 18066 inside the codition of `if (oldValue !== value) {`
if ($scope.currentStage.name === 'Treatment Outcome' && value.trim().toLowerCase() === 'died') {
    // form data element Ids
    var formData = {
        "program": $scope.currentEvent.program,
        "orgUnit": $scope.currentEvent.orgUnit,
        "event": $scope.currentEvent.event,
        "ByIsCiqkq4v": "0",
        "jdxl2rdeDEk": "",
        "WzauwhVOwM0": $scope.currentEvent.eventDate,
        "uFoaTRJ16Ch": "false",
        "K4FUK590rIU": "false",
        "js6jQi1rx1j": "false",
        "ZKBE8Xm9DJG": "XXXXXXXXX",
        "sfpqAeqKeyQ": "",
        "zb7uTuBCPrN": "",
        "QGFYJK00ES7": "",
        "CnPGhOcERFF": "",
        "Ylht9kCLSRW": "",
        "myydnkmLfhp": "",
        "aC64sB86ThG": "",
        "cmZrrHfTxW3": "",
        "eCVDO6lt4go": "",
        "hO8No9fHVd2": "",
        "fleGy9CvHYh": "",
        "WkXxkKEJLsg": ""
    }

    //dhis2 provided data element IDs mapping to form Ids
    const invertedMap = {
        "oXJtFnURX41": "nationality",
        "IpM29RJ5pnG": "CupbOInqvJI",
        "jWjSY7cktaQ": "FIfoObQJvNp",
        "zxHZoA07Sfn": "hcu4LCAMSkz",
        "ow1lbD3DwyM": "ioXkKfrgCJa:FHmHV9mElbD",
        "Gy1jHsTp9P6": "iJqBq0kQtWO",
        "Ss45XdbAmsx": "XW2CKaAiMKc",
        "GnL13HAVFOm": "e96GB4CXyd3"
    };
    console.log("formData", formData);
    // Get the current URL
    const currentURL = window.location.href;
    console.log(currentURL);
    var urlparts = window.location.pathname.split("/");
    var indexidx = urlparts.findIndex((p) => p === "index.html");
    var baseurl = window.location.origin + urlparts.slice(0, indexidx - 1).join("/");

    var urlSearchParams = new URLSearchParams(document.location.hash.substr(1).replace(/^\/\w+\?/, ""));

    // Get the values of program, tei, and ou from url
    const program = urlSearchParams.get("program");
    const tei = urlSearchParams.get("tei");
    const ou = urlSearchParams.get("ou");

    // Log the extracted values
    console.log("Program:", program);
    console.log("TEI:", tei);
    console.log("OU:", ou);

    // Define the URL to get dhis2 saved values via API
    const url = `/ima2/api/trackedEntityInstances/${tei}.json?program=${program}&ou=${ou}&fields=attributes`;

    // Fetch the JSON data (Saved Info to prefill the iframe form)
    fetch(url)
        .then((response) => {
            // Check if the response status is OK (200)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Parse the JSON response
            return response.json();
        })
        .then((jsonData) => {
            // Handle the JSON data here
            console.log(jsonData);
            // Check if the JSON data is an array
            if (Array.isArray(jsonData.attributes)) {
                // Iterate through the array of attributes
                const newMappings = [];
                // match retrived data and the data element Id mapping to prepare data for the iframe form
                jsonData.attributes.forEach((attribute) => {
                    const attributeKey = attribute.attribute;
                    if (invertedMap.hasOwnProperty(attributeKey)) {
                        const invertedKey = invertedMap[attributeKey];
                        newMappings.push({ value: attribute.value, [invertedKey]: attribute.value });
                        if (invertedKey === 'ioXkKfrgCJa:FHmHV9mElbD') {
                            try {
                                // Split the string by ":"
                                console.log(attribute.value);
                                const dataValues = attribute.value.split(":");
                                const splitValues = invertedKey.split(":");
                                formData[splitValues[0]] = dataValues[0].trim();
                                formData[splitValues[1]] = dataValues[1].trim();
                            } catch (error) {
                                console.log(error);
                                // Handle errors, and default to empty strings for both values
                                formData[invertedKey] = ""
                            }
                        } else {
                            formData[invertedKey] = attribute.value
                        }
                    }
                });

                //display the iframe and pass it the data values.
                openIcdPopup(formData);
            } else {
                console.error("JSON data is not an array of attributes.");
            }
        })
        .catch((error) => {
            // Handle any errors that occurred during the fetch
            console.error("Fetch error:", error);
        });
}