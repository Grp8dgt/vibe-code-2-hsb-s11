import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBi0c7pIOru8-phOMHe2K5xPDU5-0nLFQ0",
  authDomain: "test01-943da.firebaseapp.com",
  projectId: "test01-943da",
  storageBucket: "test01-943da.firebasestorage.app",
  messagingSenderId: "538303387712",
  appId: "1:538303387712:web:d4e251fcb66ff18906e7a5",
  measurementId: "G-2R1HWQ8V28"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);