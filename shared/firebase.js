import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

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
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

console.log('[Firebase] project:', firebaseConfig.projectId);
console.log('[Firebase] Firestore ready:', !!db);