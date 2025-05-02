// Firebase bağlantısı ve uygulama başlangıcı
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDto0VEDyrZjeJJI2T_CCU2s1dgjAl9kGw",
  authDomain: "smart-closet-966b9.firebaseapp.com",
  projectId: "smart-closet-966b9",
  storageBucket: "smart-closet-966b9.appspot.com",
  messagingSenderId: "648456771936",
  appId: "1:648456771936:web:55eab1bf0c318a95a6a605"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Smart Closet Firebase app initialized.");