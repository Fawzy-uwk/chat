// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN5vYyXy_Gpd1UoXpMprSq-77u7CJg95U",
  authDomain: "chat-9668e.firebaseapp.com",
  projectId: "chat-9668e",
  storageBucket: "chat-9668e.appspot.com",
  messagingSenderId: "181571470838",
  appId: "1:181571470838:web:222d67b40a7b0c5b43b3d7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//for login and registeration
export const auth = getAuth();

//for storing messages and users info
export const db = getFirestore();

//for storing images and files
export const storage = getStorage();
