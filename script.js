import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const lang = navigator.language || navigator.userLanguage;
document.documentElement.lang = lang;

// Giriş işlemleri
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Welcome back!");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("New account created!");
    } else {
      alert(error.message);
    }
  }
});

// Kıyafet kaydetme
async function saveClothing(itemName, isClean) {
  const user = auth.currentUser;
  if (!user) return;

  const userDoc = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDoc);

  let clothes = docSnap.exists() ? docSnap.data().clothes || [] : [];

  clothes.push({ name: itemName, clean: isClean, date: new Date().toISOString() });

  await setDoc(userDoc, { clothes }, { merge: true });
}

// Kullanıcı durumu takip
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("app").style.display = "block";
    document.getElementById("auth").style.display = "none";
  } else {
    document.getElementById("app").style.display = "none";
    document.getElementById("auth").style.display = "block";
  }
});
