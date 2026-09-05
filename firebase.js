// create and initialize your own firebase here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy2oznFM93hbY7qwaFvsEI__0Tzhx0gNI",
  authDomain: "photofolio-4be82.firebaseapp.com",
  projectId: "photofolio-4be82",
  storageBucket: "photofolio-4be82.firebasestorage.app",
  messagingSenderId: "835225353450",
  appId: "1:835225353450:web:92decad97d47b9819a2b93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };