// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFGsJJmQlxEKm1laH_mA-a7Ubh5WX79MI",
  authDomain: "nailshopweb.firebaseapp.com",
  projectId: "nailshopweb",
  storageBucket: "nailshopweb.firebasestorage.app",
  messagingSenderId: "883222587644",
  appId: "1:883222587644:web:3e46da8c981b40c37d0f79",
  measurementId: "G-99QGR3SFKB"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
