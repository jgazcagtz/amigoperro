// Function to show specific sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Handle sending WhatsApp message to the owner
document.getElementById('send-to-owner').addEventListener('click', function() {
    const walkerName = document.getElementById('walker-name').value.trim();
    const dogName = document.getElementById('walker-dog-name').value.trim();
    const startLocation = document.getElementById('start-location').value.trim();
    const walkTime = document.getElementById('walk-time').value.trim();
    const ownerPhone = document.getElementById('walker-owner-phone').value.trim();

    if (!walkerName || !dogName || !startLocation || !walkTime || !ownerPhone) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const message = `Hola, soy ${walkerName}, paseador de ${dogName}. Inicié el paseo desde ${startLocation} a las ${walkTime}.`;
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Handle sending WhatsApp message to Amigo Perro
document.getElementById('send-to-amigoperro').addEventListener('click', function() {
    const walkerName = document.getElementById('walker-name').value.trim();
    const dogName = document.getElementById('walker-dog-name').value.trim();
    const startLocation = document.getElementById('start-location').value.trim();
    const walkTime = document.getElementById('walk-time').value.trim();

    if (!walkerName || !dogName || !startLocation || !walkTime) {
        alert("Por favor, completa todos los campos necesarios.");
        return;
    }

    const message = `Paseador: ${walkerName}, Perro: ${dogName}, Punto de inicio: ${startLocation}, Hora: ${walkTime}.`;
    const amigoPerroPhone = '525527204437'; // Reemplaza con el número de WhatsApp correcto para Amigo Perro
    const whatsappUrl = `https://wa.me/${amigoPerroPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Admin authentication
function authenticateAdmin() {
    const adminPassword = document.getElementById('admin-password').value;
    const adminPanel = document.getElementById('admin-panel');

    if (adminPassword === 'admin123') { // Cambia esto por un mecanismo más seguro
        adminPanel.style.display = 'block';
        // Opcionalmente, carga los datos del administrador aquí
        loadAdminData();
    } else {
        alert("Contraseña incorrecta. Intenta de nuevo.");
    }
}

// Dummy function to load admin data
function loadAdminData() {
    const walkerData = document.getElementById('walker-data');
    // Datos de ejemplo, reemplaza con la recuperación de datos real
    const data = [
        { walker: 'Juan Pérez', dog: 'Rex', breed: 'Labrador', location: 'CDMX' },
        { walker: 'María López', dog: 'Luna', breed: 'Beagle', location: 'Guadalajara' },
        { walker: 'Carlos García', dog: 'Max', breed: 'Bulldog', location: 'Monterrey' }
    ];

    walkerData.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.walker}</td>
            <td>${item.dog}</td>
            <td>${item.breed}</td>
            <td>${item.location}</td>
        `;
        walkerData.appendChild(row);
    });
}

// Handle scheduling walk via Calendly
function scheduleWalk() {
    window.open('https://calendly.com/app/login', '_blank');
}

// Handle registered owners login
function login() {
    const email = document.getElementById('login-email').value.trim();
    const loginStatus = document.getElementById('login-status');

    if (!email) {
        loginStatus.textContent = "Por favor, ingresa tu correo electrónico.";
        loginStatus.style.color = "#d9534f";
        return;
    }

    // Lógica de inicio de sesión falsa (puedes reemplazarla con una validación real)
    if (email === "owner@example.com") {
        loginStatus.style.color = "#5cb85c";
        loginStatus.textContent = "Iniciaste sesión correctamente.";
        // Opcionalmente, navega al panel del propietario
        // showSection('owner-dashboard');
    } else {
        loginStatus.style.color = "#d9534f";
        loginStatus.textContent = "Correo no registrado.";
    }
}

// Handle owner registration
function registerOwner() {
    const ownerName = document.getElementById('owner-name').value.trim();
    const ownerEmail = document.getElementById('owner-email').value.trim();
    const ownerPhone = document.getElementById('owner-phone').value.trim();
    const ownerAddress = document.getElementById('owner-address').value.trim();
    const dogName = document.getElementById('dog-name').value.trim();
    const dogBreed = document.getElementById('dog-breed').value.trim();
    const dogAge = document.getElementById('dog-age').value.trim();
    const dogAllergies = document.getElementById('dog-allergies').value.trim();
    const dogInfo = document.getElementById('dog-info').value.trim();

    if (!ownerName || !ownerEmail || !ownerPhone || !ownerAddress || !dogName || !dogBreed || !dogAge) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Aquí puedes añadir la lógica para guardar los datos de registro
    alert("Registro exitoso! 📝");

    // Limpiar el formulario
    document.querySelector('.owner-registration').reset();

    // Navegar de vuelta a la página de inicio
    showSection('landing-page');
}

// Attach the registerOwner function to the register button
document.getElementById('register-button').addEventListener('click', registerOwner);
