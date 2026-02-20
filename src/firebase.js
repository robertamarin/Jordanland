import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHOjJnjxcJqe1pQ3UoqgJxTdh4RnhPa2c",
  authDomain: "jordanland-11a12.firebaseapp.com",
  projectId: "jordanland-11a12",
  storageBucket: "jordanland-11a12.firebasestorage.app",
  messagingSenderId: "639878394542",
  appId: "1:639878394542:web:4d9219abb623420809f33f",
  measurementId: "G-1SLC85FKJD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
