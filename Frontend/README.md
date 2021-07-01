# Frontend
### This folder contains templates of the HTML popups and template methods to load the popup information and start the exchange process (giving consent).

Our templates make use of bootstrap for fast build and for easy integration of already-made toggles. You may adapt the code to your liking and to fit the design of your platform as you wish.

### PopupTemplates.html

The HTML templates

### Styles

The template styling for the popup. These are non-mandatory and you may modify them as you see fit.

### ConsentPopups.js

Frontend methods to load the popup and start the exchange process.

***
## Note on the generation of JWT from the frontend: 

Even though we have placed the JWT generation function in the file, we recommend you generate the token from within your backend to not show your ServiceKey and ServiceSecretKey to the frontend of your application.