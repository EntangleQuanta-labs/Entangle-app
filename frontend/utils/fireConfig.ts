import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnIqejOv5oToU18sV0TL9T5vJBp7Vjztk",
  authDomain: "entangle-78c0c.firebaseapp.com",
  projectId: "entangle-78c0c",
  storageBucket: "entangle-78c0c.firebasestorage.app",
  messagingSenderId: "77044800285",
  appId: "1:77044800285:web:1e9d7443237de155a6dff4",
  measurementId: "G-22PS541P35"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


export default auth
