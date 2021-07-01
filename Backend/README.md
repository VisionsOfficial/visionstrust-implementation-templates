# Backend
### This folder contains templates of the endpoints you will need to implement in your system.




The following endpoints are to be implemented:

## Consent Export
***
### Location: EXPORT SERVICE

Endpoint that receives the consent after it was given by the user and signed by Visions. It has 3 main actions: 
- Decrypt the consent received from Visions
- Generate an access token
- Send the decrypted consent ID along with the access token to Visions

## Consent Import
***
### Location: IMPORT SERVICE

Endpoit that receives the consent after the EXPORT SERVICE generated an access token and attached to the consent by Visions as well as the data export URL from the EXPORT SERVICE. It has 1 main action: 
- Make the data export request to the receuved data export url received by sending the signed consent received from Visions

## Data Export
***
### Location: EXPORT SERVICE

Endpoint that receives the data request from the IMPORT SERVICE along with the signed consent. It has 4 main actions :
- Decrypt the consent received from the IMPORT SERVICE
- Send the consent to Visions for verification and receive the datatypes and the user corresponding to this consent as well as the data import url from the IMPORT SERVICE.
- Fetch the appropriate data from the datatypes and user received by Visions
- Send the data to the IMPORT SERVICE using the data import url received from Visions

## Data Import
***
### Location: IMPORT SERVICE

Endpoint that receives the data from the EXPORT SERVICE as well as the user concerned by this data. It has 1 main action :
- Process and save the data received for the user concerned