const request = require("request");

/**
 * Receives the signed consent from Visions and makes the Data Export request
 * 
 * The request body received looks like the following : 
 * - serviceExportUrl {string} The data export endpoint of the EXPORT SERVICE
 * - signedCOnsent {string} The signed consent to send along with the export request
 *
 * Copyright Visions 2021
 * Original Authors: Felix Bole
 */
app.post("/consent/import", async function (req, res) {

  // Request body validation
  if (req.body.serviceExportUrl != undefined && req.body.signedConsent != undefined) {

    const serviceExportUrl = req.body.serviceExportUrl;

    // Send request to the EXPORT SERVICE's data export endpoint
    request.post(
      {
        url: serviceExportUrl,
        form: {
          signedConsent: req.body.signedConsent,
          dataImportUrl: req.body.dataImportUrl,
        },
      },
      function (err, response, body) {
        // Do stuff in the request callback if you wish
      }
    );

    return res.status(200).json({
      success: true,
      message:"Data export request successfully sent to the export service."
    });

  } else {
    res.status(400).json({error: "missing-body-param-error", message: "Missing parameters from the request body." });
  }
});
