// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwnvXjF75wbQeTse7AlUwWrrGimHavGHM",
    authDomain: "emme-b0ecc.firebaseapp.com",
    projectId: "emme-b0ecc",
    storageBucket: "emme-b0ecc.appspot.com",
    messagingSenderId: "474514207945",
    appId: "1:474514207945:web:8d3ad1c0f3e84dd5140918",
    measurementId: "G-L80GFJWCJR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

function requestPermission() {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const app = initializeApp(firebaseConfig);
        } else {
            console.log("Do not have permission!");
        }
    });
}

requestPermission();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);