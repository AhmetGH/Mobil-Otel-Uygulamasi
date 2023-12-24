// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_mTomAq_q06BkfXsOPwZ6lCieaQWkTuE",
  authDomain: "hotel-app-596c6.firebaseapp.com",
  projectId: "hotel-app-596c6",
  storageBucket: "hotel-app-596c6.appspot.com",
  messagingSenderId: "242549476390",
  appId: "1:242549476390:web:d0b62226667925d4012ae7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db =getFirestore(app);