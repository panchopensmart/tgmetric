// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Ваша конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApo2Ce44REq7hgaeYKWYPoxAxG2xLhXcE",
  authDomain: "tgmetric-ac2c1.firebaseapp.com",
  projectId: "tgmetric-ac2c1",
  storageBucket: "tgmetric-ac2c1.appspot.com",
  messagingSenderId: "68470664399",
  appId: "1:68470664399:web:c06f6838d9b3370596dbba",
  measurementId: "G-SPHM0GYDZW"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
