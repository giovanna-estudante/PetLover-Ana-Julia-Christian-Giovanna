// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAjje5ICh5PBd77C9LJSRPx3sM2yt-hGo",
  authDomain: "petlover-634d0.firebaseapp.com",
  projectId: "petlover-634d0",
  storageBucket: "petlover-634d0.firebasestorage.app",
  messagingSenderId: "227010127165",
  appId: "1:227010127165:web:0f3c1c9b87678146049154"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)