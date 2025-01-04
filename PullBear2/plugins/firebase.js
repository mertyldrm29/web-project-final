// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ_ScGicZUcOzxufWWp8kG92I6LS_F5l4",
  authDomain: "web-project-16f2e.firebaseapp.com",
  projectId: "web-project-16f2e",
  storageBucket: "web-project-16f2e.firebasestorage.app",
  messagingSenderId: "974775517489",
  appId: "1:974775517489:web:a47dd6010e22a301087010",
  measurementId: "G-PS7BP1WV3P"
};

// Initialize Firebase
let app;
let db;
let auth;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      db: db,
      auth: auth
    }
  }
});