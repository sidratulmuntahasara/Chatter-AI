// Import the functions you need from the SDKs you need
import {getAuth} from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyADuQjnNarZZ7ZTbRyB5vYJWJs-FPsIhc0",
    authDomain: "chatterai-pal.firebaseapp.com",
    projectId: "chatterai-pal",
    storageBucket: "chatterai-pal.appspot.com",
    messagingSenderId: "952355054045",
    appId: "1:952355054045:web:c221a617ddb517c9165634",
    measurementId: "G-E52ZWLDPX2"
};

let auth;
let firestore;
let analytics;
if (typeof window !== "undefined"){
  // Initialize Firebase
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
  analytics = getAnalytics(app);
}

export {auth, firestore, analytics}