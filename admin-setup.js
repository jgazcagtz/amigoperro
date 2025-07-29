// Admin Setup Script
// Run this once to create the admin user

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0AxTASTitXDaf69ZJm9q4YruFvo2ESEo",
  authDomain: "amigo-perro-bf18c.firebaseapp.com",
  projectId: "amigo-perro-bf18c",
  storageBucket: "amigo-perro-bf18c.firebasestorage.app",
  messagingSenderId: "96112966515",
  appId: "1:96112966515:web:f782e3c7b6904f80096306",
  measurementId: "G-54876N45ZC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const adminEmail = "admin@amigoperro.com";
const adminPassword = "admin123456"; // Change this to a secure password

async function createAdminUser() {
    try {
        // Create admin user account
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        
        // Save admin data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: 'Administrador Amigo Perro',
            email: adminEmail,
            phone: '+52 55 2720 4437',
            userType: 'admin',
            isVerified: true,
            createdAt: new Date(),
            uid: userCredential.user.uid
        });
        
        console.log('Admin user created successfully!');
        console.log('Admin Email:', adminEmail);
        console.log('Admin Password:', adminPassword);
        console.log('Admin UID:', userCredential.user.uid);
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Run the setup
createAdminUser(); 