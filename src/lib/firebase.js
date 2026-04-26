// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkUMxx_0RDunpndxRgD0zdoMs1Y5O5oGM",
  authDomain: "easy-stay-hotel-booking.firebaseapp.com",
  projectId: "easy-stay-hotel-booking",
  storageBucket: "easy-stay-hotel-booking.firebasestorage.app",
  messagingSenderId: "587528931005",
  appId: "1:587528931005:web:892156a82a13da383159d4",
  measurementId: "G-659E28D085"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);