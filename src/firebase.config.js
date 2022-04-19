import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMr27RNlt-WUL62HspoPmAbUfZrQwSQ-E",
  authDomain: "e-realtor-app.firebaseapp.com",
  projectId: "e-realtor-app",
  storageBucket: "e-realtor-app.appspot.com",
  messagingSenderId: "846300448897",
  appId: "1:846300448897:web:f1115e0d7b87772b5c6580",
  measurementId: "G-6J0RC5NBYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)