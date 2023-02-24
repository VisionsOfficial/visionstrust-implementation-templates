# Visionstrust implementation templates

### Welcome and thank you for partnering up with Visions.

This github holds a fully functional NodeJS connector you can use out with minimal configuration as well as standalone templates for both frontend and backend code to help you with your implementation of our tool.

## Useful links

-   [Latest Documentation](https://visionstrust.com/public/docs)
-   [API Documentation (OAS3)](https://visionstrust.com/api-docs)
-   [VisionsTrust Web Platform](https://visionstrust.com)

<br/>

## Contact

If you have any questions, feel free to contact any of the following :

-   Felix Bole (Lead Developer) - <felix@visionspol.eu>
-   Matthias De Bièvre (Visions CEO) - <matthias@visionspol.eu>

<br/>

## Repository architecture

---

## src

Contains the code for the full connector. It is practically ready out of the box but you do need to plug in some of your own logic to get it completelly working.

If you wish to use it, clone this repository, then run

```bash
# Install pnpm if you don't have it installed
npm i -g pnpm

pnpm i
pnpm build
```

This will build the connector in the dist directory.

### Important note

If you try and run the connector without setting it up first, it will not work. Here are the different steps you need to do to ensure the connector will work fine

-   [ ] Make sure you have created an account on [VisionsTrust](https://visionstrust.com)
-   [ ] After cloning the repository, rename .env.sample to .env and set your own env variables such as your serviceKey and secretKey provided when creating a VisionsTrust account
-   [ ] Make sure you have implemented a way to register user identifiers using the [helper methods](./src/utils/users.ts) for registering users in VisionsTrust. _This step is important as the system needs to know user identifiers to enable a data exchange_

If you are a Data Provider (Export Service)

-   [ ] Add [your own logic](./src/routes/data.ts) to retrieve user data in your system based on the user information and the selected datatypes

If you are a Data Consumer (Import Service)

-   [ ] Add [your own logic](./src/routes/data.ts) to process and store the data after receiving it from the Export service

---

### [Examples](./examples/)

The examples directory contains isolated independant scripts if you wish to use only individual components instead of the full connector. However, the code in the [connector](./src/) is more detailed and precise than those in the [examples](./examples/)

#### Backend

Holds all the endpoints you need to implement in your system in order to take part in the data portability processes.

-   Consent Export
-   Consent Import
-   Data Export
-   Data Import

The folder has its own README file for more details.

---

### Frontend

Holds templates for the HTML consent popups and generic non-framework related javascript using easily adaptable jQuery in some parts of the logic.

You will find methods to :

-   Load and populate an import or export oriented exchange consent popup.
-   Retrieve the user input from the consent popup and launch the exchange process (import or export).

The folder has its own README file for more details.
