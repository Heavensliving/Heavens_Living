


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBL52StHxrivv3w1QMu9Gqp8bb2CFqFT-U",
  authDomain: "heaven-living.firebaseapp.com",
  projectId: "heaven-living",
  storageBucket: "heaven-living.appspot.com",
  messagingSenderId: "870098037601",
  appId: "1:870098037601:web:fc3e9640c8d99fc5ecf320",
  measurementId: "G-84BLRFT3DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;