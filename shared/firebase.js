import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbh23qFBvg13uo1TxpzaGi2CGJym21lu0",
  authDomain: "test-01-a5dc8.firebaseapp.com",
  projectId: "test-01-a5dc8",
  storageBucket: "test-01-a5dc8.firebasestorage.app",
  messagingSenderId: "252950259636",
  appId: "1:252950259636:web:1abac7b87b54a3e70174e1",
  measurementId: "G-GMLJLK4YZ5"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
