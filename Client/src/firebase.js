// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hermes-student-portal.firebaseapp.com",
  projectId: "hermes-student-portal",
  storageBucket: "hermes-student-portal.appspot.com",
  messagingSenderId: "94788388870",
  appId: "1:94788388870:web:706173fcad98f759e41b87",
  measurementId: "G-NR7QC62LEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);