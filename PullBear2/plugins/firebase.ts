import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Auth, User } from "firebase/auth";
import { defineNuxtPlugin } from '#app';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyAJ_ScGicZUcOzxufWWp8kG92I6LS_F5l4",
    authDomain: "web-project-16f2e.firebaseapp.com",
    projectId: "web-project-16f2e",
    storageBucket: "web-project-16f2e.firebasestorage.app",
    messagingSenderId: "974775517489",
    appId: "1:974775517489:web:a47dd6010e22a301087010",
    measurementId: "G-PS7BP1WV3P"
  };

  const app: FirebaseApp = initializeApp(firebaseConfig);
  const auth: Auth = getAuth(app);
  const db: Firestore = getFirestore(app);

  // Kullanıcı durumunu localStorage'da sakla
  auth.onAuthStateChanged((user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  });

  nuxtApp.provide('db', db);
  nuxtApp.provide('auth', auth);
}); 