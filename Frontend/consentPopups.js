// Here are templates for the frontend logic concerning the Exchange Consent Popups.

// We use the following scripts and stylesheets but you are free to adapt the 
// functions described below if you do not wish to use any of the following.

// --- Bootstrap
// <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"/>
// <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>

// --- Bootstrap toggles
// <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet"/>
// <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.js" data-turbolinks-track="true"></script>

//JQuery
// <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>

// jsrsasign -> If you wish to generate JWT tokens through frontend (We recommend doing so from the backend)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.20/jsrsasign-all-min.js"></script>

const SERVICE_KEY  = "" // Your service key
const SECRET_KEY   = "" // Your service secret key
const USER_KEY     = "" // Yohe User Key of the user currently logged in
const PURPOSE_ID   = "" // The ID of the purpose for which you are generating the popup
const EMAIL_IMPORT = "" // The Email of the user in your service (ONLY FOR IMPORT EXCHANGES)
const EMAIL_EXPORT = "" // The Email of the user in your service (ONLY FOR EXPORT EXCHANGES)
const SERVICE_NAME = "" // The name of your service
const API_BASE_URL = "https://visionstrust/v1"

let datatypeIds = null, 
    checkboxIds = null, 
    services    = null;

/**
* Loads and builds the import popup after requesting data from Visionstrust API
*
* Copyright 2021 Visions
* Original Authors: Felix Bole
* 
* @param {string} flow import||export, if you are loading an import or export popup
*/
const loadPopup = (flow) => {

    let checkboxes = [];
    datatypesIds   = [];
    checkboxIds    = [];
    services       = [];

    let requestBody = { purpose: PURPOSE_ID };

    if(flow == "import") requestBody.emailImport = EMAIL_IMPORT;
    else requestBody.emailExport = EMAIL_EXPORT;

    fetch(API_BASE_URL + "/popups/" + flow, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer " + generateJWT(SERVICE_KEY, SECRET_KEY),
        }),
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        const datatypes = data.datatypes;

        let html = "";

        for (let i = 0; i < datatypes.length; i++) {

            const datatype = datatypes[i];

            if(flow == "import") {
                // Store all possible Export Services
                if(services.indexOf(datatype.provenance) == -1)
                    services.push(datatype.provenance);
            }


            let tmpHtml = `
                <tr>
                    <td>
                        <span id='datatype${i}' data-datatype='${datatype.id}'>${datatype.name}</span>
                        <span class='text-primary h6'> (${datatype.provenance})</span>
                    </td>
                    <td>
                        <input 
                            class='text-white' 
                            type='checkbox' 
                            data-onstyle='primary' 
                            data-offstyle='danger' 
                            data-toggle='toggle'
                            data-on='Oui'
                            data-off='Non'
                            id='checkbox${datatype.id}'
                        />
                    </td>
                </tr>
            `;

            if(datatypeIds[datatype.provenance] == undefined) {

                datatypeIds[datatype.provenance] = ["datatype" + i];
                checkboxIds[datatype.provenance] = ["checkbox" + datatype.id];

            } else {

                datatypeIds[datatype.provenance].push("datatype" + i);
                checkboxIds[datatype.provenance].push("checkbox" + datatype.id);

            }

            checkboxes.push("checkbox" + datatype.id);

            html += tmpHtml;
        }

        if(flow == "import") {

            let emailsExport = data.emailsExport;
    
            for(let i = 0; i < services.length; i++) {
    
                let hasEmail = undefined;
    
                if(emailsExport)
                    hasEmail = emailsExport.find(item => item.service === services[i]);
    
                let email = hasEmail != undefined ? hasEmail.email : "";
    
                html += `
                    <tr>
                        <td>Email in <span class="text-primary h6">${services[i]}</span></td>
                        <td>
                            <div class="row">
                                <div class="col-md-10">
                                    <input type="email" class="form-control" value="${email}" id="emailExport-${services[i]}/>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            }
            
        } else {
            let emailImport = data.emailImport;

            html += `
                <tr>
                    <td>
                        Email chez <span class='text-primary h6'>${data.serviceImport}</span>
                    </td>
                    <td>
                        <input type="email" lass="form-control" value="${emailImport}"id="emailImport"/>
                    </td>
                </tr>
            `;
        }


        let terms = `
            <div class="dropdown">
                <small class="dropbtn">Mentions légales & conditions d'utilisation</small>
                <div class="dropdown-content">
                    <a class="dropdown-item" href="${flow == 'import' ? data.tosImport : data.tosExport}">${SERVICE_NAME}</a>
        `;

        if(flow = "import") {
            if(data.exportServices.length > 0) {
                for(let service of data.exportServices) {
                    if(service.termsOfUse)
                        terms += `<a class="dropdown-item" href="${s.termsOfUse}">${s.serviceName}</a>`;
                }
            }
        } else {
            terms += `<a class="dropdown-item" href="${data.tosImport}">${data.serviceImport}</a>`;
        }


        terms += "</div></div>";

        // Insert information into popup
        document.getElementById(`${flow}PurposeDescription`).innerText = data.description;
        document.getElementById(`${flow}tbody`).innerHTML = html;
        document.getElementById(`${flow}Tos`).innerHTML = terms;

        if(flow == "export") {
            let importLogo = document.getElementById('exportModalExportServiceLogo');
            importLogo.src = data.serviceImportLogo;
            importLogo.alt = data.serviceImport;

            document.getElementById("noAccountServiceImport").innerText = data.serviceImport;
        }

        for (let i = 0; i < datatypes.length; i++) {
            if(datatype.checked === true) {
                $("#" + checkboxes[i]).bootstrapToggle("on");
            } else {
                $("#" + checkboxes[i]).bootstrapToggle("off");
            }
        }

        $("#"+flow+"Modal").modal({ show: true });
    })
}

/**
* Gathers user consented data and launches the import process
*
* Copyright 2021 Visions
* Original Authors: Felix Bole
*/
const startImportProcess = () => {
    let requestBody = [];
    let current = 0;

    for (let service of services) {
        let datatypesIds = datatypesIds[service];
        let checkIds = checkboxIds[service];
        let datatypes = [];

        for(let i = 0; i < datatypesIds.length; i++) {
            let dt = $("#" + datatypeIds[i]).text();
            let id = $("#" + datatypeIds[i]).data("datatype");
            let ck = $("#" + checkIds[i]).is(":checked");

            datatypes.push({
                id,
                datatype: dt,
                checked: ck
            });
        }

        let emailExport = document.getElementById("emailExport-" + service).value;

        let data = {
            datatypes: datatypes,
            emailImport: EMAIL_IMPORT,
            emailExport: emailExport,
            serviceExport: service,
            purpose: PURPOSE_ID,
            userKey: USER_KEY
        }

        requestBody.push(data);
    }

    $("#exportModal").modal("hide");

    var requests = requestBody.map(body => {
        return {
            url: API_BASE_URL + "/consents/exchange/import",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + generateJWT(SERVICE_KEY, SECRET_KEY),   
            },
            body: JSON.stringify(body),
        }
    })

    function makeRequest() {
        if(current < requests.length) {
            fetch(requests[current].url, {
                headers: requests[current].headers,
                body: requests[current].body,
            })
            .then((res) => {
                current++;
                makeRequest();
            })
        } else {
            alert("No more requests to make.");
        }
    }

    makeRequest();
}

/**
* Gathers user consented data and launches the export process
*
* Copyright 2021 Visions
* Original Authors: Felix Bole
*/
const startExportProcess = () => {
    let datatypes = [];

	for (let i = 0; i < datatypesIds.length; i++) {
		const dt = $("#" + datatypesIds[i]).text();
		const id = $("#" + datatypesIds[i]).data("datatype");
		const ck = $("#" + checkboxIds[i]).is(":checked");
		
		datatypes.push({
			id: id,
			datatype: dt,
			checked: ck,
		});
	}

    const isNewAccount = $("#isNewAccount").is(":checked");	
	const emailImport = $("#emailImport").val();

    const requestBody = {
        datatypes,
        emailImport: emailImport,
        emailExport: EMAIL_EXPORT,
        userKey: USER_KEY,
        isNewAccount,
    };

    fetch(API_BASE_URL + "/consents/exchange/export", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + generateJWT(SERVICE_KEY, SECRET_KEY),   
        },
        body: JSON.stringify(requestBody)
    })
    .then(res => res.json())
    .then(data => {
        if(data.redirectionUrl) {
            // Consent created but paused, waiting on the user to create an account in the import service
            // Redirect the user using the received url
            location.href = data.redirectionUrl;
        }

        if(data.verifyEmail) {
            // Consent created but waiting on the user to validate his email via the email sent to data.emailImport address

            // Do something: i.e. show a message to the user telling him he needs to validate his email
        }
    })
}

/**
* Generates the authorization JWT needed to interact with the VisionsTrust API
*
* Copyright 2021 Visions
* Original Authors: Felix Bole
*/
const generateJWT = (serviceKey, secretKey) => {
    var oHeader = { alg: "HS256", typ: "JWT" };
    var payload = {};
    var tNow = KJUR.jws.IntDate.get("now");
    payload.iat = tNow;
    payload = {
      serviceKey,
      iat: tNow,
      exp: tNow + 5 * 60,
    };
    var sHeader = JSON.stringify(oHeader);
    var sPayload = JSON.stringify(payload);
    var sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secretKey);
    return sJWT;
}