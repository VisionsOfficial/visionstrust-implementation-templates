const {SERVICE_KEY, SERVICE_SECRET_KEY, API_BASE_URL} = require('./config/config');
const auth = require("./utils/auth"); // For generation of a JWT for authentication with the Visionstrust API

const fs = require("fs");
const request = require("request");
const crypto = require("crypto");

/**
 * Sends the data to the import service after making consent verification with Visions
 * and gathering the data from the info sent back by the Visions verification
 *
 * Copyright Visions 2021
 * Original Authors: Felix Bole
 */
app.post("/data/export", async function (req, res) {

  // Retrieve public key for consent decryption
  const publicKeyFromFile = fs
    .readFileSync("./config/rsa-encrypt-public.pem")
    .toString();

  const publicKey = crypto.createPublicKey(publicKeyFromFile);

  let decryptedData = crypto.publicDecrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(req.body.signedConsent,'base64')
  );

  decryptedData = JSON.parse(decryptedData.toString());

  if (decryptedData) {

    const consentId = decryptedData.consentId;
    const token = decryptedData.token;
    const serviceName = decryptedData.serviceExportName;

    request.post(
      {
        url: API_BASE_URL + "/consents/verify/",
        headers: { "x-auth-token": auth.getJwtToken(SERVICE_KEY, SERVICE_SECRET_KEY) },
        form: {
          consentId: consentId,
          token: token,
        },
      },
      function (err, response, body) {
        if (!err) {
          body = JSON.parse(body);
          if (body.success === true) {
            if (body.datatypes.length === 0) {
              return res.status(400).json({
                error: "empty-consent-datatyes-error",
                message: "Empty datatypes array returned.",
              });
            }

            // Get datatypes from your database and send them to the IMPORT SERVICE
            getData(body.userExport.userServiceId, body.datatypes).then((data) => {
              request.post(
                {
                  url: req.body.dataImportUrl,
                  form: {
                    success: true,
                    data: data,
                    user: body.userImport.userServiceId,
                    service: serviceName,
                  },
                },
                function (error, response1, body1) {
                  // Do something with the request callback
                }
              );
            });
          } else {
            // Do something 
          }
        } else {
          // Error
        }
      }
    );
  } else {
    res.status(500).statusMessage("Consent verification failed");
  }
});

/**
 * Evidently, you may use any type of data fetching method to match your database
 * @param {string} userId The ID of your user
 * @param {array} datatypes The datatypes pointing to the specific data
 */
function getData(userId, datatypes) {
  // Retrieve data from your database for this userId and the specified datatypes
}

