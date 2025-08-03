// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc, updateDoc, query, where, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
    initializeAppUI();
    setupEventListeners();
    checkAuthState();
});

// Initialize App Function
function initializeAppUI() {
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
    
    // Schedule walk form
    const scheduleWalkForm = document.getElementById('schedule-walk-form');
    if (scheduleWalkForm) {
        scheduleWalkForm.addEventListener('submit', handleScheduleWalk);
    }
    
    // Enhanced form navigation
    setupFormNavigation();
    
    // Password strength checker
    setupPasswordStrength();
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// Form Navigation
function setupFormNavigation() {
    // Next step buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = e.target.closest('.form-step');
            const nextStep = currentStep.nextElementSibling;
            const currentStepNum = parseInt(currentStep.dataset.step);
            const nextStepNum = currentStepNum + 1;
            
            if (validateCurrentStep(currentStep)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                updateProgressSteps(nextStepNum);
            }
        });
    });
    
    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = e.target.closest('.form-step');
            const prevStep = currentStep.previousElementSibling;
            const currentStepNum = parseInt(currentStep.dataset.step);
            const prevStepNum = currentStepNum - 1;
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            updateProgressSteps(prevStepNum);
        });
    });
}

// Validate current form step
function validateCurrentStep(step) {
    const inputs = step.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Update progress steps
function updateProgressSteps(activeStep) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Password strength checker
function setupPasswordStrength() {
    const ownerPasswordInput = document.getElementById('owner-password');
    const ownerStrengthIndicator = document.getElementById('password-strength');
    const walkerPasswordInput = document.getElementById('walker-password');
    const walkerStrengthIndicator = document.getElementById('walker-password-strength');
    
    if (ownerPasswordInput && ownerStrengthIndicator) {
        ownerPasswordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = checkPasswordStrength(password);
            
            ownerStrengthIndicator.className = 'password-strength ' + strength;
        });
    }
    
    if (walkerPasswordInput && walkerStrengthIndicator) {
        walkerPasswordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = checkPasswordStrength(password);
            
            walkerStrengthIndicator.className = 'password-strength ' + strength;
        });
    }
}

// Check password strength
function checkPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Navigation Functions
window.showSection = function(sectionId) {
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
window.switchTab = function(tabType) {
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

// Schedule Walk Modal Functions
window.showScheduleWalkModal = function() {
    document.getElementById('schedule-walk-modal').style.display = 'flex';
    loadDogsForSchedule();
};

window.closeScheduleModal = function() {
    document.getElementById('schedule-walk-modal').style.display = 'none';
};

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
    
    // Validate terms acceptance
    const termsAccepted = document.getElementById('owner-terms').checked;
    const privacyAccepted = document.getElementById('owner-privacy').checked;
    
    if (!termsAccepted || !privacyAccepted) {
        showNotification('Debes aceptar los términos y condiciones y la política de privacidad', 'error');
        return;
    }
    
    // Validate password confirmation
    const password = document.getElementById('owner-password').value;
    const passwordConfirm = document.getElementById('owner-password-confirm').value;
    
    if (password !== passwordConfirm) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    const userData = {
        name: document.getElementById('owner-name').value,
        email: document.getElementById('owner-email').value,
        phone: document.getElementById('owner-phone').value,
        address: document.getElementById('owner-address').value,
        birthdate: document.getElementById('owner-birthdate').value,
        password: password,
        userType: 'owner',
        termsAccepted: true,
        privacyAccepted: true,
        createdAt: new Date()
    };
    
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Save user data to Firestore with default rating
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...userData,
            uid: userCredential.user.uid,
            // Rating system - all users start with 5 stars
            averageRating: 5.0,
            totalRatings: 0,
            ratingCount: 0
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
    
    // Validate terms acceptance
    const termsAccepted = document.getElementById('walker-terms').checked;
    const privacyAccepted = document.getElementById('walker-privacy').checked;
    const insuranceConfirmed = document.getElementById('walker-insurance').checked;
    
    if (!termsAccepted || !privacyAccepted) {
        showNotification('Debes aceptar los términos y condiciones y la política de privacidad', 'error');
        return;
    }
    
    if (!insuranceConfirmed) {
        showNotification('Debes confirmar que tienes seguro de responsabilidad civil', 'error');
        return;
    }
    
    // Validate password confirmation
    const password = document.getElementById('walker-password').value;
    const passwordConfirm = document.getElementById('walker-password-confirm').value;
    
    if (password !== passwordConfirm) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    const userData = {
        name: document.getElementById('walker-name').value,
        email: document.getElementById('walker-email').value,
        phone: document.getElementById('walker-phone').value,
        birthdate: document.getElementById('walker-birthdate').value,
        experience: document.getElementById('walker-experience').value,
        zones: document.getElementById('walker-zones').value,
        description: document.getElementById('walker-description').value,
        password: password,
        userType: 'walker',
        isVerified: false,
        termsAccepted: true,
        privacyAccepted: true,
        insuranceConfirmed: true,
        createdAt: new Date()
    };
    
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Save user data to Firestore with default rating
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...userData,
            uid: userCredential.user.uid,
            // Rating system - all users start with 5 stars
            averageRating: 5.0,
            totalRatings: 0,
            ratingCount: 0
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
            
            if (userData.userType === loginType) {
                userType = userData.userType;
                currentUser = userCredential.user;
                showSection('dashboard');
                showNotification(`Bienvenido ${userData.name}`, 'success');
                loadUserData();
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
    
    // Load active walks
    await loadActiveWalksOwner();
    
    // Load walk history
    await loadWalkHistory();
    
    // Load user ratings
    await loadUserRatings();
}

async function loadWalkerDashboard() {
    const dashboardContent = document.getElementById('walker-dashboard');
    dashboardContent.classList.add('active');
    
    // Load available walks
    await loadAvailableWalks();
    
    // Load accepted walks
    await loadAcceptedWalks();
    
    // Load active walks
    await loadActiveWalks();
    
    // Load walker history
    await loadWalkerHistory();
    
    // Load walker ratings
    await loadWalkerRatings();
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
        
        dogsList.innerHTML = dogsHTML || '<p>No tienes amigos registrados</p>';
    } catch (error) {
        console.error('Error loading dogs:', error);
    }
}

// Load dogs for schedule modal
async function loadDogsForSchedule() {
    const dogSelect = document.getElementById('walk-dog');
    try {
        const dogsQuery = query(collection(db, 'dogs'), where('ownerId', '==', currentUser.uid));
        const dogsSnapshot = await getDocs(dogsQuery);
        
        let optionsHTML = '<option value="">Selecciona tu amigo</option>';
        dogsSnapshot.forEach(doc => {
            const dog = doc.data();
            optionsHTML += `<option value="${doc.id}">${dog.name} (${dog.breed})</option>`;
        });
        
        dogSelect.innerHTML = optionsHTML;
    } catch (error) {
        console.error('Error loading dogs for schedule:', error);
    }
}

window.showAddDogModal = function() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Agregar Amigo';
    modalBody.innerHTML = `
        <form id="add-dog-form">
            <div class="form-group">
                <label>Nombre del Amigo</label>
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
            <button type="submit" class="btn btn-primary">Agregar Amigo</button>
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
        showNotification('Amigo agregado exitosamente', 'success');
        closeModal();
        loadDogsList();
    } catch (error) {
        console.error('Error adding dog:', error);
        showNotification('Error al agregar amigo', 'error');
    }
}

// Schedule Walk Function
async function handleScheduleWalk(e) {
    e.preventDefault();
    
    const walkData = {
        dogId: document.getElementById('walk-dog').value,
        dogName: document.getElementById('walk-dog').options[document.getElementById('walk-dog').selectedIndex].text,
        date: document.getElementById('walk-date').value,
        time: document.getElementById('walk-time').value,
        duration: parseInt(document.getElementById('walk-duration').value),
        zone: document.getElementById('walk-zone').value,
        notes: document.getElementById('walk-notes').value,
        budget: document.getElementById('walk-budget').value || null,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || 'Dueño',
        status: 'pending',
        createdAt: new Date()
    };
    
    try {
        await addDoc(collection(db, 'walks'), walkData);
        showNotification('Paseo programado exitosamente', 'success');
        closeScheduleModal();
        loadScheduledWalks();
        document.getElementById('schedule-walk-form').reset();
    } catch (error) {
        console.error('Error scheduling walk:', error);
        showNotification('Error al programar paseo', 'error');
    }
}

// Walk Management
async function loadScheduledWalks() {
    const scheduledWalks = document.getElementById('scheduled-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('ownerId', '==', currentUser.uid),
            where('status', '==', 'pending')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-card">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(walk.date).toLocaleDateString()}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-clock"></i>
                            <span>${walk.time}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-hourglass-half"></i>
                            <span>${walk.duration} min</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${walk.zone}</span>
                        </div>
                    </div>
                    <div class="walk-actions">
                        <span class="walk-status pending">Pendiente</span>
                        <button class="btn btn-secondary" onclick="cancelWalk('${doc.id}')">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            `;
        });
        
        scheduledWalks.innerHTML = walksHTML || '<p>No hay paseos programados</p>';
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
                <div class="walk-card">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(walk.date).toLocaleDateString()}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-clock"></i>
                            <span>${walk.duration} minutos</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-user"></i>
                            <span>Paseador: ${walk.walkerName}</span>
                        </div>
                    </div>
                    <div class="walk-actions">
                        <span class="walk-status completed">Completado</span>
                    </div>
                </div>
            `;
        });
        
        walkHistory.innerHTML = historyHTML || '<p>No hay historial de paseos</p>';
    } catch (error) {
        console.error('Error loading walk history:', error);
    }
}

// Walker Dashboard Functions
async function loadAvailableWalks() {
    const availableWalks = document.getElementById('available-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('status', '==', 'pending')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            
            // Get owner rating (default to 5.0 if not available)
            const ownerRating = walk.ownerRating || 5.0;
            
            walksHTML += `
                <div class="walk-card">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(walk.date).toLocaleDateString()}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-clock"></i>
                            <span>${walk.time}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-hourglass-half"></i>
                            <span>${walk.duration} min</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${walk.zone}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>${walk.budget ? `$${walk.budget} MXN` : 'Sin presupuesto'}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-star"></i>
                            <span>Dueño: ${ownerRating.toFixed(1)} ⭐</span>
                        </div>
                    </div>
                    ${walk.notes ? `<p><strong>Notas:</strong> ${walk.notes}</p>` : ''}
                    <div class="walk-actions">
                        <span class="walk-status pending">Disponible</span>
                        <button class="btn btn-primary" onclick="acceptWalk('${doc.id}')">
                            <i class="fas fa-check"></i> Aceptar Paseo
                        </button>
                    </div>
                </div>
            `;
        });
        
        availableWalks.innerHTML = walksHTML || '<p>No hay paseos disponibles</p>';
    } catch (error) {
        console.error('Error loading available walks:', error);
    }
}

async function loadAcceptedWalks() {
    const acceptedWalks = document.getElementById('accepted-walks');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('walkerId', '==', currentUser.uid),
            where('status', '==', 'accepted')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-card">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(walk.date).toLocaleDateString()}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-clock"></i>
                            <span>${walk.time}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-user"></i>
                            <span>${walk.ownerName}</span>
                        </div>
                    </div>
                    <div class="contact-info">
                        <h5>Información de Contacto</h5>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${walk.ownerPhone || 'No disponible'}</span>
                        </div>
                        <a href="https://wa.me/52${walk.ownerPhone?.replace(/\D/g, '')}?text=Hola, soy tu paseador para el paseo de ${walk.dogName}" 
                           class="whatsapp-contact" target="_blank">
                            <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
                        </a>
                    </div>
                    <div class="walk-actions">
                        <span class="walk-status accepted">Aceptado</span>
                        <button class="btn btn-secondary" onclick="confirmWalkWithOwner('${doc.id}')">
                            <i class="fas fa-phone"></i> Confirmar con Dueño
                        </button>
                        <button class="btn btn-primary" onclick="startWalk('${doc.id}')">
                            <i class="fas fa-play"></i> Iniciar Paseo
                        </button>
                    </div>
                </div>
            `;
        });
        
        acceptedWalks.innerHTML = walksHTML || '<p>No hay paseos aceptados</p>';
    } catch (error) {
        console.error('Error loading accepted walks:', error);
        acceptedWalks.innerHTML = '<p>Error al cargar paseos aceptados</p>';
    }
}

async function acceptWalk(walkId) {
    try {
        // Get walker info
        const walkerDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const walkerData = walkerDoc.data();
        
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'accepted',
            walkerId: currentUser.uid,
            walkerName: walkerData.name,
            walkerPhone: walkerData.phone,
            acceptedAt: new Date()
        });
        
        showNotification('Paseo aceptado exitosamente', 'success');
        loadAvailableWalks();
        loadAcceptedWalks();
    } catch (error) {
        console.error('Error accepting walk:', error);
        showNotification('Error al aceptar paseo', 'error');
    }
}

async function startWalk(walkId) {
    try {
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'active',
            startTime: new Date()
        });
        
        showNotification('Paseo iniciado', 'success');
        loadAcceptedWalks();
        loadActiveWalks();
    } catch (error) {
        console.error('Error starting walk:', error);
        showNotification('Error al iniciar paseo', 'error');
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

// Global Functions for HTML onclick
window.acceptWalk = async function(walkId) {
    try {
        // Show confirmation dialog
        if (!confirm('¿Estás seguro de que quieres aceptar este paseo? Una vez aceptado, deberás contactar al dueño para confirmar.')) {
            return;
        }

        // Get walker info
        const walkerDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const walkerData = walkerDoc.data();
        
        // Get walk info to contact owner
        const walkDoc = await getDoc(doc(db, 'walks', walkId));
        const walkData = walkDoc.data();
        
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'accepted',
            walkerId: currentUser.uid,
            walkerName: walkerData.name,
            walkerPhone: walkerData.phone,
            acceptedAt: new Date()
        });
        
        showNotification('Paseo aceptado exitosamente. Contacta al dueño para confirmar.', 'success');
        
        // Show contact info for owner
        const ownerContact = `Contacta al dueño: ${walkData.ownerName} - ${walkData.ownerPhone}`;
        alert(`${ownerContact}\n\nWhatsApp: ${walkData.ownerPhone}\n\nConfirma con el dueño antes de iniciar el paseo.`);
        
        loadAvailableWalks();
        loadAcceptedWalks();
    } catch (error) {
        console.error('Error accepting walk:', error);
        showNotification('Error al aceptar paseo', 'error');
    }
}

window.confirmWalkWithOwner = async function(walkId) {
    try {
        const walkDoc = await getDoc(doc(db, 'walks', walkId));
        const walkData = walkDoc.data();
        
        if (confirm(`¿Has confirmado con el dueño ${walkData.ownerName} que puedes iniciar el paseo?`)) {
            await updateDoc(doc(db, 'walks', walkId), {
                status: 'confirmed',
                confirmedAt: new Date()
            });
            
            showNotification('Paseo confirmado con el dueño', 'success');
            loadAcceptedWalks();
        }
    } catch (error) {
        console.error('Error confirming walk:', error);
        showNotification('Error al confirmar paseo', 'error');
    }
}

window.startWalk = async function(walkId) {
    try {
        if (!confirm('¿Estás listo para iniciar el paseo?')) {
            return;
        }
        
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'active',
            startTime: new Date()
        });
        
        showNotification('Paseo iniciado', 'success');
        loadAcceptedWalks();
        loadActiveWalks();
    } catch (error) {
        console.error('Error starting walk:', error);
        showNotification('Error al iniciar paseo', 'error');
    }
}

window.endWalk = async function(walkId) {
    try {
        if (!confirm('¿Has completado el paseo?')) {
            return;
        }
        
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'completed',
            endTime: new Date()
        });
        
        showNotification('Paseo completado. El dueño puede calificarte.', 'success');
        loadActiveWalks();
        loadAcceptedWalks();
    } catch (error) {
        console.error('Error ending walk:', error);
        showNotification('Error al completar paseo', 'error');
    }
}

window.cancelWalk = async function(walkId) {
    try {
        if (!confirm('¿Estás seguro de que quieres cancelar este paseo?')) {
            return;
        }
        
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'cancelled',
            cancelledAt: new Date()
        });
        
        showNotification('Paseo cancelado', 'success');
        loadScheduledWalks();
    } catch (error) {
        console.error('Error cancelling walk:', error);
        showNotification('Error al cancelar paseo', 'error');
    }
}

window.rateUser = async function(userId, userName, walkId) {
    try {
        const rating = prompt('Califica de 1 a 5 estrellas:');
        const ratingNum = parseInt(rating);
        
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            showNotification('Por favor ingresa un número del 1 al 5', 'error');
            return;
        }
        
        const comment = prompt('Comentario (opcional):') || '';
        
        // Create rating document
        await addDoc(collection(db, 'ratings'), {
            raterId: currentUser.uid,
            raterName: currentUser.displayName || currentUser.email,
            ratedUserId: userId,
            ratedUserName: userName,
            walkId: walkId,
            rating: ratingNum,
            comment: comment,
            createdAt: new Date()
        });
        
        // Update user's average rating
        await updateUserAverageRating(userId);
        
        showNotification('Calificación enviada exitosamente', 'success');
        loadUserRatings();
    } catch (error) {
        console.error('Error rating user:', error);
        showNotification('Error al enviar calificación', 'error');
    }
}

window.openWhatsApp = function() {
    const message = encodeURIComponent('Hola! Me interesa el servicio de paseos de Amigo Perro 🐾');
    window.open(`https://wa.me/525527204437?text=${message}`, '_blank');
}

window.closeModal = function() {
    document.getElementById('modal-overlay').classList.remove('active');
}

window.closeScheduleModal = function() {
    document.getElementById('schedule-walk-modal').style.display = 'none';
}

window.showAddDogModal = function() {
    // Implementation for adding dog modal
    alert('Función de agregar perro próximamente');
}

window.showScheduleWalkModal = function() {
    document.getElementById('schedule-walk-modal').style.display = 'flex';
    loadDogsForSchedule();
}

window.selectService = function(serviceName, price) {
    const message = encodeURIComponent(`Hola! Me interesa contratar: ${serviceName} - $${price} MXN`);
    window.open(`https://wa.me/525527204437?text=${message}`, '_blank');
}

window.logout = function() {
    signOut(auth).then(() => {
        showNotification('Sesión cerrada exitosamente', 'success');
        showSection('home');
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
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
                <div class="walk-card">
                    <h4>Paseo en Curso con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-user"></i>
                            <span>${walk.ownerName}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-play"></i>
                            <span>Iniciado: ${new Date(walk.startTime.toDate()).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <div class="contact-info">
                        <h5>Contacto del Dueño</h5>
                        <a href="https://wa.me/52${walk.ownerPhone?.replace(/\D/g, '')}?text=Hola, estoy paseando a ${walk.dogName}" 
                           class="whatsapp-contact" target="_blank">
                            <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
                        </a>
                    </div>
                    <div class="walk-actions">
                        <span class="walk-status active">En Curso</span>
                        <button class="btn btn-primary" onclick="endWalk('${doc.id}')">
                            <i class="fas fa-stop"></i> Finalizar Paseo
                        </button>
                    </div>
                </div>
            `;
        });
        
        activeWalks.innerHTML = walksHTML || '<p>No hay paseos activos</p>';
    } catch (error) {
        console.error('Error loading active walks:', error);
    }
}

async function loadActiveWalksOwner() {
    const activeWalksOwner = document.getElementById('active-walks-owner');
    try {
        const walksQuery = query(
            collection(db, 'walks'),
            where('ownerId', '==', currentUser.uid),
            where('status', '==', 'active')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let walksHTML = '';
        walksSnapshot.forEach(doc => {
            const walk = doc.data();
            walksHTML += `
                <div class="walk-card">
                    <h4>Paseo en Curso con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-user"></i>
                            <span>Paseador: ${walk.walkerName}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-play"></i>
                            <span>Iniciado: ${new Date(walk.startTime.toDate()).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <div class="contact-info">
                        <h5>Contacto del Paseador</h5>
                        <a href="https://wa.me/52${walk.walkerPhone?.replace(/\D/g, '')}?text=Hola, soy el dueño de ${walk.dogName}" 
                           class="whatsapp-contact" target="_blank">
                            <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
                        </a>
                    </div>
                    <div class="walk-actions">
                        <span class="walk-status active">En Curso</span>
                    </div>
                </div>
            `;
        });
        
        activeWalksOwner.innerHTML = walksHTML || '<p>No hay paseos activos</p>';
    } catch (error) {
        console.error('Error loading active walks for owner:', error);
    }
}

async function endWalk(walkId) {
    try {
        if (!confirm('¿Has completado el paseo?')) {
            return;
        }
        
        const endTime = new Date();
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'completed',
            endTime: endTime,
            duration: Math.round((endTime - new Date()) / 60000), // Duration in minutes
            canRate: true
        });
        
        showNotification('Paseo completado. Ambos pueden calificarse.', 'success');
        
        // Show rating prompt
        const shouldRate = confirm('¿Quieres calificar al dueño?');
        if (shouldRate) {
            const walkDoc = await getDoc(doc(db, 'walks', walkId));
            const walkData = walkDoc.data();
            await rateUser(walkData.ownerId, walkData.ownerName, walkId);
        }
        
        loadActiveWalks();
        loadWalkerHistory();
    } catch (error) {
        console.error('Error ending walk:', error);
        showNotification('Error al finalizar paseo', 'error');
    }
}

async function cancelWalk(walkId) {
    try {
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'cancelled',
            cancelledAt: new Date()
        });
        
        showNotification('Paseo cancelado', 'success');
        loadScheduledWalks();
    } catch (error) {
        console.error('Error cancelling walk:', error);
        showNotification('Error al cancelar paseo', 'error');
    }
}

async function loadWalkerHistory() {
    const walkerHistory = document.getElementById('walker-history');
    try {
        // Simplified query to avoid index issues
        const walksQuery = query(
            collection(db, 'walks'),
            where('walkerId', '==', currentUser.uid),
            where('status', '==', 'completed')
        );
        const walksSnapshot = await getDocs(walksQuery);
        
        let historyHTML = '';
        const walks = [];
        walksSnapshot.forEach(doc => {
            walks.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by date manually
        walks.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        walks.forEach(walk => {
            historyHTML += `
                <div class="walk-card">
                    <h4>Paseo con ${walk.dogName}</h4>
                    <div class="walk-info">
                        <div class="walk-info-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(walk.date).toLocaleDateString()}</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-clock"></i>
                            <span>${walk.duration || 'N/A'} minutos</span>
                        </div>
                        <div class="walk-info-item">
                            <i class="fas fa-user"></i>
                            <span>Dueño: ${walk.ownerName}</span>
                        </div>
                    </div>
                    <div class="walk-actions">
                        <span class="walk-status completed">Completado</span>
                        ${walk.canRate ? `<button class="btn btn-primary" onclick="rateUser('${walk.ownerId}', '${walk.ownerName}', '${walk.id}')">
                            <i class="fas fa-star"></i> Calificar Dueño
                        </button>` : ''}
                    </div>
                </div>
            `;
        });
        
        walkerHistory.innerHTML = historyHTML || '<p>No hay historial de paseos</p>';
    } catch (error) {
        console.error('Error loading walker history:', error);
        walkerHistory.innerHTML = '<p>Error al cargar historial</p>';
    }
}

// Rating Functions
async function loadUserRatings() {
    const userRatings = document.getElementById('user-ratings');
    try {
        const ratingsQuery = query(
            collection(db, 'ratings'),
            where('ratedUserId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        const ratingsSnapshot = await getDocs(ratingsQuery);
        
        let ratingsHTML = '';
        ratingsSnapshot.forEach(doc => {
            const rating = doc.data();
            ratingsHTML += `
                <div class="rating-item">
                    <div class="rating-header">
                        <span class="rating-user">${rating.raterName}</span>
                        <span class="rating-date">${new Date(rating.createdAt.toDate()).toLocaleDateString()}</span>
                    </div>
                    <div class="rating-stars-small">
                        ${generateStars(rating.rating)}
                    </div>
                    <div class="rating-comment">${rating.comment || 'Sin comentario'}</div>
                </div>
            `;
        });
        
        userRatings.innerHTML = ratingsHTML || '<p>No hay calificaciones aún</p>';
    } catch (error) {
        console.error('Error loading user ratings:', error);
    }
}

async function loadWalkerRatings() {
    const walkerRatings = document.getElementById('walker-ratings');
    try {
        // Simplified query to avoid index issues
        const ratingsQuery = query(
            collection(db, 'ratings'),
            where('ratedUserId', '==', currentUser.uid)
        );
        const ratingsSnapshot = await getDocs(ratingsQuery);
        
        let ratingsHTML = '';
        const ratings = [];
        ratingsSnapshot.forEach(doc => {
            ratings.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by date manually
        ratings.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()));
        
        ratings.forEach(rating => {
            ratingsHTML += `
                <div class="rating-item">
                    <div class="rating-header">
                        <span class="rating-user">${rating.raterName}</span>
                        <span class="rating-date">${new Date(rating.createdAt.toDate()).toLocaleDateString()}</span>
                    </div>
                    <div class="rating-stars-small">
                        ${generateStars(rating.rating)}
                    </div>
                    <div class="rating-comment">${rating.comment || 'Sin comentario'}</div>
                </div>
            `;
        });
        
        walkerRatings.innerHTML = ratingsHTML || '<p>No hay calificaciones aún</p>';
    } catch (error) {
        console.error('Error loading walker ratings:', error);
        walkerRatings.innerHTML = '<p>Error al cargar calificaciones</p>';
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Rating System Functions
async function updateUserAverageRating(userId) {
    try {
        const ratingsQuery = query(
            collection(db, 'ratings'),
            where('ratedUserId', '==', userId)
        );
        const ratingsSnapshot = await getDocs(ratingsQuery);
        
        let totalRating = 0;
        let ratingCount = 0;
        
        ratingsSnapshot.forEach(doc => {
            const rating = doc.data();
            totalRating += rating.rating;
            ratingCount++;
        });
        
        const averageRating = ratingCount > 0 ? totalRating / ratingCount : 5.0;
        
        // Update user's rating in Firestore
        await updateDoc(doc(db, 'users', userId), {
            averageRating: averageRating,
            totalRatings: totalRating,
            ratingCount: ratingCount
        });
        
        return averageRating;
    } catch (error) {
        console.error('Error updating user average rating:', error);
        return 5.0;
    }
}

async function getUserRating(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                averageRating: userData.averageRating || 5.0,
                ratingCount: userData.ratingCount || 0
            };
        }
        return { averageRating: 5.0, ratingCount: 0 };
    } catch (error) {
        console.error('Error getting user rating:', error);
        return { averageRating: 5.0, ratingCount: 0 };
    }
}

async function displayUserRating(userId, containerId) {
    try {
        const rating = await getUserRating(userId);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="rating-display">
                    <span class="rating-number">${rating.averageRating.toFixed(1)}</span>
                    <div class="stars">
                        ${generateStars(rating.averageRating)}
                    </div>
                    <span class="rating-count">(${rating.ratingCount} reseñas)</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error displaying user rating:', error);
    }
}

// Enhanced walk functions with rating system
async function completeWalkWithRating(walkId) {
    try {
        const walkDoc = await getDoc(doc(db, 'walks', walkId));
        const walkData = walkDoc.data();
        
        if (!walkData) {
            showNotification('Paseo no encontrado', 'error');
            return;
        }
        
        // Update walk status
        await updateDoc(doc(db, 'walks', walkId), {
            status: 'completed',
            endTime: new Date(),
            canRate: true
        });
        
        showNotification('Paseo completado. Ambos pueden calificarse.', 'success');
        
        // Show rating options
        const shouldRate = confirm('¿Quieres calificar al ' + (currentUser.uid === walkData.ownerId ? 'paseador' : 'dueño') + '?');
        if (shouldRate) {
            const userIdToRate = currentUser.uid === walkData.ownerId ? walkData.walkerId : walkData.ownerId;
            const userNameToRate = currentUser.uid === walkData.ownerId ? walkData.walkerName : walkData.ownerName;
            await rateUser(userIdToRate, userNameToRate, walkId);
        }
        
        loadActiveWalks();
        loadAcceptedWalks();
    } catch (error) {
        console.error('Error completing walk with rating:', error);
        showNotification('Error al completar paseo', 'error');
    }
}

// Enhanced rating function with better UI
async function rateUserEnhanced(userId, userName, walkId) {
    try {
        // Create a simple rating modal
        const rating = prompt(`Califica a ${userName} de 1 a 5 estrellas:`);
        const ratingNum = parseInt(rating);
        
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            showNotification('Por favor ingresa un número del 1 al 5', 'error');
            return;
        }
        
        const comment = prompt('Comentario (opcional):') || '';
        
        // Check if already rated
        const existingRatingQuery = query(
            collection(db, 'ratings'),
            where('raterId', '==', currentUser.uid),
            where('ratedUserId', '==', userId),
            where('walkId', '==', walkId)
        );
        const existingRatingSnapshot = await getDocs(existingRatingQuery);
        
        if (!existingRatingSnapshot.empty) {
            showNotification('Ya has calificado a este usuario por este paseo', 'error');
            return;
        }
        
        // Create rating document
        await addDoc(collection(db, 'ratings'), {
            raterId: currentUser.uid,
            raterName: currentUser.displayName || currentUser.email,
            ratedUserId: userId,
            ratedUserName: userName,
            walkId: walkId,
            rating: ratingNum,
            comment: comment,
            createdAt: new Date()
        });
        
        // Update user's average rating
        await updateUserAverageRating(userId);
        
        showNotification('Calificación enviada exitosamente', 'success');
        loadUserRatings();
    } catch (error) {
        console.error('Error rating user:', error);
        showNotification('Error al enviar calificación', 'error');
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

// Service Selection and WhatsApp Integration
window.selectService = function(serviceName, price) {
    const message = `¡Hola! Me interesa contratar el servicio: ${serviceName} por $${price} MXN. ¿Podrían proporcionarme más información y agendar una cita? 🐾`;
    window.openWhatsAppWithMessage(message);
}

window.openWhatsAppWithMessage = function(message) {
    const phoneNumber = '525527204437';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Global WhatsApp function
window.openWhatsApp = function() {
    const phoneNumber = '525527204437';
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre los servicios de Amigo Perro 🐾');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            // Create WhatsApp message
            const subjectText = {
                'consulta': 'Consulta General',
                'paseos': 'Paseos y Entrenamiento',
                'cursos': 'Cursos de Adiestramiento',
                'emergencia': 'Paseo de Emergencia',
                'precios': 'Consulta de Precios',
                'otro': 'Otro'
            }[subject] || 'Consulta';
            
            const whatsappMessage = `¡Hola! Soy ${name} y tengo una consulta sobre: ${subjectText}

${message}

Espero su respuesta. ¡Gracias! 🐾`;
            
            // Open WhatsApp with the message
            window.openWhatsAppWithMessage(whatsappMessage);
            
            // Reset form
            contactForm.reset();
        });
    }
});
