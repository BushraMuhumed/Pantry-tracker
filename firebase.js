// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHcRJ1pNA1jysmeRWQD9RF5QQkrCFJGvk",
  authDomain: "pantry-tracker-40e67.firebaseapp.com",
  projectId: "pantry-tracker-40e67",
  storageBucket: "pantry-tracker-40e67.appspot.com",
  messagingSenderId: "732350784421",
  appId: "1:732350784421:web:c28a1a52497cd70569be4c",
  measurementId: "G-Y3R6MG5QME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore= getFirestore(app);
export {firestore};