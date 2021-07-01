const {SERVICE_KEY, SERVICE_SECRET_KEY, API_BASE_URL} = require('./config/config');
const auth = require("./utils/auth"); // For generation of a JWT for authentication with the Visionstrust API

const fs = require("fs");
const request = require("request");//Package for making requests, you can also use axios or node-fetch
const crypto = require("crypto"); //NodeJs package for encryption


/**
 * Generates an access token to send back to Visions
 *
 * Copyright Visions 2021
 * Original Authors: Felix Bole
 */

app.post("/consent/export", async function (req, res, next) {

  // Request body validation
  if (req.body.signedConsent) {

    // Retrieve public key used for consent decryption
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
      let originalConsent = decryptedData;

      // Generate access token
      const token = generateAccessToken()

      const consentId = originalConsent.consentId;

      // Send the token to visions
      request.post(
        {
          url: API_BASE_URL + "/consents/token",
          headers: { "Authorization": "Bearer " + auth.getJwtToken(SERVICE_KEY, SERVICE_SECRET_KEY) },
          form: {
            token: token,
            consentId: consentId,
          },
        },
        function (err, response, body) {
          // Do stuff in the callback if you wish
        }
      );
    } else {
      res
        .status(404)
        .json({ 
          error: "consent-decryption-error", 
          message: "Something went wrong when decrypting the signed consent." 
        });
    }
  }
});


/**
 * Evidently, you may use any type of token generation method that suits your needs
 * 
 * @returns {string} The access token
 */
function generateAccessToken() {
  let token = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 50; i++) {
    token += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return token;
}