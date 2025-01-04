// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin(nuxtApp => {
  const firebaseConfig = {
    apiKey: "AIzaSyAJ_ScGicZUcOzxufWWp8kG92I6LS_F5l4",
    authDomain: "web-project-16f2e.firebaseapp.com",
    projectId: "web-project-16f2e",
    storageBucket: "web-project-16f2e.firebasestorage.app",
    messagingSenderId: "974775517489",
    appId: "1:974775517489:web:a47dd6010e22a301087010",
    measurementId: "G-PS7BP1WV3P"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Kullanıcı durumunu localStorage'da sakla
  auth.onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  });

  nuxtApp.provide('db', db);
  nuxtApp.provide('auth', auth);
});