# Visionstrust implementation templates

### Welcome and thank you for partnering up with Visions.

This github holds templates for both frontend and backend code to help you with your implementation of our tool.

## Useful links
- [Latest Documentation](https://docs.google.com/document/d/1rkPIGh-8Hi0yhKiJLNxMp5mf9jCzWGmHbTMFoCgQbUs/edit?usp=sharing)
- [API Documentation (OAS3)](https://visionstrust.com/api-docs)
- [VisionsTrust Web Platform](https://visionstrust.com)

<br/>

## Contact

If you have any questions, feel free to contact any of the following : 
- Felix Bole (Lead Developer) - <felix@visionspol.eu>
- Matthias De Bièvre (Visions CEO) - <matthias@visionspol.eu>

<br/>

## Repository architecture
***
### Backend folder

Holds all the endpoints you need to implement in your system in order to take part in the data portability processes.

- Consent Export
- Consent Import
- Data Export
- Data Import

The folder has its own README file for more details.
***
### Frontend folder

Holds templates for the HTML consent popups and generic non-framework related javascript using easily adaptable jQuery in some parts of the logic.

You will find methods to : 
- Load and populate an import or export oriented exchange consent popup.
- Retrieve the user input from the consent popup and launch the exchange process (import or export).

The folder has its own README file for more details.
