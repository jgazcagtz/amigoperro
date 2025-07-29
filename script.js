// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc, updateDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0AxTASTitXDaf69ZJm9q4YruFvo2ESEo",
  authDomain: "amigo-perro-bf18c.firebaseapp.com",
  projectId: "amigo-perro-bf18c",
  storageBucket: "amigo-perro-bf18c.firebasestorage.app",
  messagingSenderId: "96112966515",
  appId: "1:96112966515:web:f782e3c7b6904f80096306",
  measurementId: "G-54876N45ZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Global Variables
let currentUser = null;
let userType = null;

// DOM Elements
const loadingSpinner = document.getElementById('loading-spinner');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthState();
});

// Initialize App Function
function initializeApp() {
    // Hide loading spinner after a short delay
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile navigation toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Form submissions
    document.getElementById('owner-registration-form').addEventListener('submit', handleOwnerRegistration);
    document.getElementById('walker-registration-form').addEventListener('submit', handleWalkerRegistration);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    updateNavigation(sectionId);
}

function updateNavigation(activeSection) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section link
    const activeLink = document.querySelector(`[onclick="showSection('${activeSection}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Tab Switching
function switchTab(tabType) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.register-form').forEach(form => {
        form.classList.remove('active');
    });
    
    if (tabType === 'owner') {
        document.getElementById('owner-form').classList.add('active');
    } else if (tabType === 'walker') {
        document.getElementById('walker-form').classList.add('active');
    }
}

// Authentication Functions
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadUserData();
        } else {
            currentUser = null;
            userType = null;
            showSection('home');
        }
    });
}

async function handleOwnerRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('owner-name') || document.getElementById('owner-name').value,
        email: formData.get('owner-email') || document.getElementById('owner-email').value,
        phone: formData.get('owner-phone') || document.getElementById('owner-phone').value,
        address: formData.get('owner-address') || document.getElementById('owner-address').value,
        password: formData.get('owner-password') || document.getElementById('owner-password').value,
        userType: 'owner',
        createdAt: new Date()
    };
    
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...userData,
            uid: userCredential.user.uid
        });
        
        showNotification('Registro exitoso! Bienvenido a Amigo Perro', 'success');
        showSection('dashboard');
        
    } catch (error) {
        console.error('Error registering owner:', error);
        showNotification(getErrorMessage(error.code), 'error');
    }
}

async function handleWalkerRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('walker-name') || document.getElementById('walker-name').value,
        email: formData.get('walker-email') || document.getElementById('walker-email').value,
        phone: formData.get('walker-phone') || document.getElementById('walker-phone').value,
        experience: formData.get('walker-experience') || document.getElementById('walker-experience').value,
        zones: formData.get('walker-zones') || document.getElementById('walker-zones').value,
        password: formData.get('walker-password') || document.getElementById('walker-password').value,
        userType: 'walker',
        isVerified: false,
        createdAt: new Date()
    };
    
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...userData,
            uid: userCredential.user.uid
        });
        
        showNotification('Registro exitoso! Tu cuenta será verificada pronto', 'success');
        showSection('dashboard');
        
    } catch (error) {
        console.error('Error registering walker:', error);
        showNotification(getErrorMessage(error.code), 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginType = document.getElementById('login-type').value;
    
    if (!email || !password || !loginType) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (loginType === 'admin' && email === 'admin@amigoperro.com') {
                userType = 'admin';
                showSection('dashboard');
                showNotification('Bienvenido Administrador', 'success');
            } else if (userData.userType === loginType) {
                userType = userData.userType;
                showSection('dashboard');
                showNotification(`Bienvenido ${userData.name}`, 'success');
            } else {
                await signOut(auth);
                showNotification('Tipo de usuario incorrecto', 'error');
            }
        }
        
    } catch (error) {
        console.error('Error logging in:', error);
        showNotification(getErrorMessage(error.code), 'error');
    }
}

async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            userType = userData.userType;
            
            if (userType === 'owner') {
                loadOwnerDashboard();
            } else if (userType === 'walker') {
                loadWalkerDashboard();
            } else if (userType === 'admin') {
                loadAdminDashboard();
            }
            
            showSection('dashboard');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Dashboard Functions
async function loadOwnerDashboard() {
    const dashboardContent = document.getElementById('owner-dashboard');
    dashboardContent.classList.add('active');
    
    // Load owner's dogs
    await loadDogsList();
    
    // Load scheduled walks
    await loadScheduledWalks();
    
    // Load walk history
    await loadWalkHistory();
}

async function loadWalkerDashboard() {
    const dashboardContent = document.getElementById('walker-dashboard');
    dashboardContent.classList.add('active');
    
    // Load pending walks
    await loadPendingWalks();
    
    // Load active walks
    await loadActiveWalks();
    
    // Load walker history
    await loadWalkerHistory();
}

async function loadAdminDashboard() {
    const dashboardContent = document.getElementById('admin-dashboard');
    dashboardContent.classList.add('active');
    
    // Load admin statistics
    await loadAdminStats();
    
    // Load active walks for admin
    await loadAdminActiveWalks();
}

// Dog Management
async function loadDogsList() {
    const dogsList = document.getElementById('dogs-list');
    try {
        const dogsQuery = query(collection(db, 'dogs'), where('ownerId', '==', currentUser.uid));
        const dogsSnapshot = await getDocs(dogsQuery);
        
        let dogsHTML = '';
        dogsSnapshot.forEach(doc => {
            const dog = doc.data();
            dogsHTML += `
                <div class="dog-item">
                    <h4>${dog.name}</h4>
                    <p><strong>Raza:</strong> ${dog.breed}</p>
                    <p><strong>Edad:</strong> ${dog.age} años</p>
                    <button class="btn btn-secondary" onclick="editDog('${doc.id}')">Editar</button>
                </div>
            `;
        });
        
        dogsList.innerHTML = dogsHTML || '<p>No tienes perros registrados</p>';
    } catch (error) {
        console.error('Error loading dogs:', error);
    }
}

function showAddDogModal() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Agregar Perro';
    modalBody.innerHTML = `
        <form id="add-dog-form">
            <div class="form-group">
                <label>Nombre del Perro</label>
                <input type="text" id="dog-name" required>
            </div>
            <div class="form-group">
                <label>Raza</label>
                <input type="text" id="dog-breed" required>
            </div>
            <div class="form-group">
                <label>Edad (años)</label>
                <input type="number" id="dog-age" min="0" required>
            </div>
            <div class="form-group">
                <label>Alergias (opcional)</label>
                <input type="text" id="dog-allergies">
            </div>
            <div class="form-group">
                <label>Información Adicional</label>
                <textarea id="dog-info" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Agregar Perro</button>
        </form>
    `;
    
    document.getElementById('modal-overlay').classList.add('active');
    
    // Add form submission handler
    document.getElementById('add-dog-form').addEventListener('submit', handleAddDog);
}

async function handleAddDog(e) {
    e.preventDefault();
    
    const dogData = {
        name: document.getElementById('dog-name').value,
        breed: document.getElementById('dog-breed').value,
        age: parseInt(document.getElementById('dog-age').value),
        allergies: document.getElementById('dog-allergies').value,
        info: document.getElementById('dog-info').value,
        ownerId: currentUser.uid,
        createdAt: new Date()
    };
    
    try {
        await addDoc(collection(db, 'dogs'), dogData);
        showNotification('Perro agregado exitosamente', 'success');
        closeModal();
        loadDogsList();
    } catch (error) {
        console.error('Error adding dog:', error);
        showNotification('Error al agregar perro', 'error');
    }
}

// Walk Management
async function loadScheduledWalks() {
    const scheduledWalks = document.getElementById('scheduled-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('ownerId', '==', currentUser.uid),
            where('status', '==', 'scheduled')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-item">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <p><strong>Fecha:</strong> ${new Date(walk.date).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> ${walk.time}</p>
                    <p><strong>Paseador:</strong> ${walk.walkerName}</p>
                </div>
            `;
        });
        
        scheduledWalks.innerHTML = walksHTML || '<p>No tienes paseos programados</p>';
    } catch (error) {
        console.error('Error loading scheduled walks:', error);
    }
}

async function loadWalkHistory() {
    const walkHistory = document.getElementById('walk-history');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('ownerId', '==', currentUser.uid),
            where('status', '==', 'completed'),
            orderBy('date', 'desc')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let historyHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            historyHTML += `
                <div class="walk-item">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <p><strong>Fecha:</strong> ${new Date(walk.date).toLocaleDateString()}</p>
                    <p><strong>Duración:</strong> ${walk.duration} minutos</p>
                    <p><strong>Paseador:</strong> ${walk.walkerName}</p>
                </div>
            `;
        });
        
        walkHistory.innerHTML = historyHTML || '<p>No hay historial de paseos</p>';
    } catch (error) {
        console.error('Error loading walk history:', error);
    }
}

// Walker Dashboard Functions
async function loadPendingWalks() {
    const pendingWalks = document.getElementById('pending-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('walkerId', '==', currentUser.uid),
            where('status', '==', 'pending')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-item">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <p><strong>Fecha:</strong> ${new Date(walk.date).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> ${walk.time}</p>
                    <p><strong>Dueño:</strong> ${walk.ownerName}</p>
                    <button class="btn btn-primary" onclick="startWalk('${doc.id}')">Iniciar Paseo</button>
                </div>
            `;
        });
        
        pendingWalks.innerHTML = walksHTML || '<p>No hay paseos pendientes</p>';
    } catch (error) {
        console.error('Error loading pending walks:', error);
    }
}

async function startWalk(walkId) {
    try {
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'active',
            startTime: new Date()
        });
        
        showNotification('Paseo iniciado', 'success');
        loadPendingWalks();
        loadActiveWalks();
    } catch (error) {
        console.error('Error starting walk:', error);
        showNotification('Error al iniciar paseo', 'error');
    }
}

// Admin Dashboard Functions
async function loadAdminStats() {
    try {
        // Count owners
        const ownersQuery = query(collection(db, 'users'), where('userType', '==', 'owner'));
        const ownersSnapshot = await getDocs(ownersQuery);
        
        // Count walkers
        const walkersQuery = query(collection(db, 'users'), where('userType', '==', 'walker'));
        const walkersSnapshot = await getDocs(walkersQuery);
        
        // Count dogs
        const dogsSnapshot = await getDocs(collection(db, 'dogs'));
        
        document.getElementById('total-owners').textContent = ownersSnapshot.size;
        document.getElementById('total-walkers').textContent = walkersSnapshot.size;
        document.getElementById('total-dogs').textContent = dogsSnapshot.size;
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

async function loadAdminActiveWalks() {
    const adminActiveWalks = document.getElementById('admin-active-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('status', '==', 'active')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-item">
                    <h4>Paseo en Curso</h4>
                    <p><strong>Perro:</strong> ${walk.dogName}</p>
                    <p><strong>Paseador:</strong> ${walk.walkerName}</p>
                    <p><strong>Dueño:</strong> ${walk.ownerName}</p>
                    <p><strong>Iniciado:</strong> ${new Date(walk.startTime.toDate()).toLocaleTimeString()}</p>
                </div>
            `;
        });
        
        adminActiveWalks.innerHTML = walksHTML || '<p>No hay paseos activos</p>';
    } catch (error) {
        console.error('Error loading admin active walks:', error);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'El email ya está registrado',
        'auth/invalid-email': 'Email inválido',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };
    
    return errorMessages[errorCode] || 'Error desconocido';
}

function openWhatsApp() {
    const message = encodeURIComponent('Hola! Me interesa el servicio de paseos de Amigo Perro 🐾');
    window.open(`https://wa.me/525527204437?text=${message}`, '_blank');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function logout() {
    signOut(auth).then(() => {
        showNotification('Sesión cerrada exitosamente', 'success');
        showSection('home');
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

function generateReport() {
    // This would generate a comprehensive report
    showNotification('Reporte generado y descargado', 'success');
}

// Additional functions for walker dashboard
async function loadActiveWalks() {
    const activeWalks = document.getElementById('active-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('walkerId', '==', currentUser.uid),
            where('status', '==', 'active')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-item">
                    <h4>Paseo en Curso</h4>
                    <p><strong>Perro:</strong> ${walk.dogName}</p>
                    <p><strong>Dueño:</strong> ${walk.ownerName}</p>
                    <p><strong>Iniciado:</strong> ${new Date(walk.startTime.toDate()).toLocaleTimeString()}</p>
                    <button class="btn btn-primary" onclick="endWalk('${doc.id}')">Finalizar Paseo</button>
                </div>
            `;
        });
        
        activeWalks.innerHTML = walksHTML || '<p>No hay paseos activos</p>';
    } catch (error) {
        console.error('Error loading active walks:', error);
    }
}

async function endWalk(walkId) {
    try {
        const endTime = new Date();
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'completed',
            endTime: endTime,
            duration: Math.round((endTime - new Date()) / 60000) // Duration in minutes
        });
        
        showNotification('Paseo finalizado', 'success');
        loadActiveWalks();
        loadWalkerHistory();
    } catch (error) {
        console.error('Error ending walk:', error);
        showNotification('Error al finalizar paseo', 'error');
    }
}

async function loadWalkerHistory() {
    const walkerHistory = document.getElementById('walker-history');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('walkerId', '==', currentUser.uid),
            where('status', '==', 'completed'),
            orderBy('date', 'desc')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let historyHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            historyHTML += `
                <div class="walk-item">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <p><strong>Fecha:</strong> ${new Date(walk.date).toLocaleDateString()}</p>
                    <p><strong>Duración:</strong> ${walk.duration || 'N/A'} minutos</p>
                    <p><strong>Dueño:</strong> ${walk.ownerName}</p>
                </div>
            `;
        });
        
        walkerHistory.innerHTML = historyHTML || '<p>No hay historial de paseos</p>';
    } catch (error) {
        console.error('Error loading walker history:', error);
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .walk-item {
        background: var(--white);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        box-shadow: var(--shadow);
    }
    
    .dog-item {
        background: var(--white);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        box-shadow: var(--shadow);
    }
`;
document.head.appendChild(style);
