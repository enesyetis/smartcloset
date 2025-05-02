import { auth, db } from './firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
        alert("Giriş başarılı!");
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Yeni hesap oluşturuldu!");
            } catch (createError) {
                alert("Hesap oluşturma hatası: " + createError.message);
            }
        } else {
            alert("Giriş hatası: " + error.message);
        }
    }
});

// Kıyafet kaydetme
async function saveClothing(itemName, isClean) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        let clothes = docSnap.exists() ? docSnap.data().clothes || [] : [];

        clothes.push({
            name: itemName,
            clean: isClean,
            date: new Date().toISOString()
        });

        await setDoc(userDoc, {
            clothes
        }, {
            merge: true
        });
        alert("Kıyafet kaydedildi!");
        displayClothing(); // Kıyafet kaydedildikten sonra listeyi güncelle
    } catch (error) {
        alert("Kıyafet kaydetme hatası: " + error.message);
    }
}

// Kıyafetleri listeleme
async function displayClothing() {
    const user = auth.currentUser;
    if (!user) return;

    const clothesList = document.getElementById("clothes-ul");
    clothesList.innerHTML = ""; // Önceki listeyi temizle

    try {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists() && docSnap.data().clothes) {
            const clothes = docSnap.data().clothes;
            clothes.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.name} - ${item.clean ? "Temiz" : "Kirli"} - ${new Date(item.date).toLocaleDateString()}`;
                clothesList.appendChild(li);
            });
        }
    } catch (error) {
        alert("Kıyafetleri listeleme hatası: " + error.message);
    }
}

// Çıkış yapma
document.getElementById("logout").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Çıkış yapıldı!");
    } catch (error) {
        alert("Çıkış yapma hatası: " + error.message);
    }
});

// Kullanıcı durumu takip
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById("app").style.display = "block";
        document.getElementById("auth").style.display = "none";
        displayClothing(); // Kıyafetleri listele
    } else {
        document.getElementById("app").style.display = "none";
        document.getElementById("auth").style.display = "block";
    }
});

// Kıyafet kaydetme butonu
document.getElementById("save-clothing").addEventListener("click", () => {
    const itemName = document.getElementById("item-name").value;
    const isClean = document.getElementById("item-clean").value === "true";
    saveClothing(itemName, isClean);
});