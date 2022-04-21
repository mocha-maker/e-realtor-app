# E-Realtor App
Online marketplace for users to rent or sell their properties.

This is a React / Firebase project from [Brad Traversy](https://github.com/bradtraversy/)'s the React Front To Back 2022 course

# Built With

## This project used the following tools & frameworks:
* [Create-React-App](https://create-react-app.dev/)
* [Firebase](https://firebase.google.com/)
* [Toastify](https://www.npmjs.com/package/react-toastify)
* [Geoapify API](https://www.geoapify.com/)
* [SwiperJS](https://swiperjs.com/get-started)
* [React Leaflet](https://react-leaflet.js.org/)
## Skills demonstrated
* 3rd Party API
* HTTPS Requests
* OAuth
* Mobile First Design
* Firebase and Firestore DB Management

## Updates & Improvements
* Refactored navbar active link function to return the highlight color
* UI updates for sign-up and sign-in pages
* Various UI updates on `index.css` (sizing)

# Installation & Usage

If you want to autfill geolocation:
1. Rename .env.example to .env
2. Get an API key for Geocoding API [here](https://myprojects.geoapify.com/)

ELSE in the CreateListing.jsx file you can set geolocationEnabled to "false" and it will add a lat/lng field to the form

Connect with your own firebase-firestore db by replacing the `firebase.config.js` data with your own.
## Install Dependencies
```node
npm install
```

## Run App
```node
npm start
```