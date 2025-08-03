# Amigo Perro - Plataforma de Paseos Caninos

## Descripción
Amigo Perro es una plataforma que conecta dueños de perros con paseadores profesionales. Los dueños pueden programar paseos y los paseadores pueden ver y aceptar paseos disponibles.

## Características Principales

### Para Dueños (Owners)
- Registro y gestión de perros
- Programación de paseos con detalles específicos
- Seguimiento del estado de los paseos
- Historial de paseos completados
- Sistema de calificaciones para paseadores

### Para Paseadores (Walkers)
- **Ver todos los paseos disponibles**: Los paseadores pueden ver todos los paseos con estado 'pending' publicados por cualquier dueño
- Aceptar paseos disponibles
- Gestionar paseos activos
- Historial de paseos completados
- Sistema de calificaciones

## Visibilidad de Paseos

### Cómo Funciona
1. **Dueños crean paseos**: Cuando un dueño programa un paseo, se crea con estado 'pending'
2. **Paseadores ven todos los paseos pendientes**: Cualquier paseador autenticado puede ver todos los paseos con estado 'pending'
3. **Paseadores aceptan paseos**: Los paseadores pueden aceptar cualquier paseo disponible
4. **Estado cambia a 'accepted'**: Una vez aceptado, el paseo solo es visible para el dueño y el paseador asignado

### Reglas de Seguridad
- **Lectura de paseos pendientes**: Cualquier usuario autenticado puede leer paseos con estado 'pending'
- **Escritura de paseos**: Solo el dueño del paseo o el paseador asignado pueden modificar un paseo
- **Paseos aceptados**: Solo el dueño y el paseador asignado pueden ver paseos con estado 'accepted' o 'active'

## Configuración de Firebase

### Reglas de Firestore
Las reglas de seguridad permiten:
- Lectura de paseos pendientes para todos los usuarios autenticados
- Escritura de paseos solo para dueños y paseadores asignados
- Gestión completa de usuarios, perros y calificaciones

### Colecciones de Datos
- `users`: Información de usuarios (dueños y paseadores)
- `dogs`: Información de perros registrados
- `walks`: Paseos programados y su estado
- `ratings`: Calificaciones entre usuarios

## Instalación y Configuración

1. Clona el repositorio
2. Configura Firebase en tu proyecto
3. Copia las reglas de Firestore desde `firestore-rules.txt`
4. Configura la autenticación de Firebase
5. Ejecuta la aplicación

## Tecnologías Utilizadas
- HTML5, CSS3, JavaScript (ES6+)
- Firebase Authentication
- Firestore Database
- Responsive Design

## Contacto
- WhatsApp: 55-27-20-44-37
- Instagram: @amigo.perro.cdmx
- Horarios: 8am - 8pm 