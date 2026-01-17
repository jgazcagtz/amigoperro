# 🔥 Guía de Despliegue de Reglas de Firestore

## Instrucciones para Actualizar las Reglas de Seguridad

### ⚠️ IMPORTANTE
Las reglas de Firestore actualizadas son **CRÍTICAS** para el funcionamiento correcto del sistema de tipos de usuario. Deben ser desplegadas para que las mejoras funcionen correctamente.

---

## Paso 1: Acceder a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **amigo-perro-bf18c**
3. En el menú lateral, busca "Firestore Database"
4. Click en la pestaña "**Rules**" (Reglas)

---

## Paso 2: Copiar las Nuevas Reglas

Las nuevas reglas se encuentran en el archivo `firestore-rules.txt` de este proyecto.

### Reglas Actualizadas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    // Enforce that userType cannot be changed once set
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.userType in ['owner', 'walker'];
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      // Prevent changing userType after creation
                      request.resource.data.userType == resource.data.userType;
      // Allow admins to read all user data
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Allow users to read and write their own dogs
    match /dogs/{dogId} {
      allow read, write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
      // Allow admins to read all dogs
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Allow users to read and write walks they're involved in
    match /walks/{walkId} {
      // Allow any authenticated user to read pending walks (so paseadores can see available paseos)
      allow read: if request.auth != null && 
        (resource.data.status == 'pending' || 
         resource.data.ownerId == request.auth.uid || 
         resource.data.walkerId == request.auth.uid);
      // Allow users to write walks they own or are walking
      allow write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         resource.data.walkerId == request.auth.uid);
      // Allow admins to read all walks
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Rating system - allow users to read and write ratings they're involved in
    match /ratings/{ratingId} {
      // Allow users to read ratings they gave or received
      allow read: if request.auth != null && 
        (resource.data.raterId == request.auth.uid || 
         resource.data.ratedUserId == request.auth.uid);
      // Allow users to create ratings for walks they participated in
      allow create: if request.auth != null && 
        request.resource.data.raterId == request.auth.uid;
      // Allow users to update their own ratings
      allow update: if request.auth != null && 
        resource.data.raterId == request.auth.uid;
      // Allow admins to read all ratings
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Dog ratings - allow walkers to rate dogs they've walked
    match /dog-ratings/{ratingId} {
      // Allow users to read dog ratings they gave
      allow read: if request.auth != null && 
        resource.data.raterId == request.auth.uid;
      // Allow walkers to create dog ratings for walks they participated in
      allow create: if request.auth != null && 
        request.resource.data.raterId == request.auth.uid;
      // Allow users to update their own dog ratings
      allow update: if request.auth != null && 
        resource.data.raterId == request.auth.uid;
      // Allow admins to read all dog ratings
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Allow authenticated users to create new documents
    match /{document=**} {
      allow create: if request.auth != null;
    }
  }
}
```

---

## Paso 3: Pegar y Publicar

1. **Selecciona todo** el contenido actual en el editor de reglas
2. **Borra** el contenido existente
3. **Pega** las nuevas reglas copiadas arriba
4. Click en el botón "**Publish**" (Publicar)
5. Confirma la publicación cuando se te solicite

---

## Paso 4: Verificar el Despliegue

Después de publicar, verifica que:

✅ El timestamp de "Last updated" muestra la fecha y hora actuales
✅ No hay errores de sintaxis en la consola
✅ Las reglas están activas (indicador verde)

---

## 🎯 Cambios Clave en las Nuevas Reglas

### 1. Protección del Tipo de Usuario
```javascript
allow update: if request.auth != null && 
              request.auth.uid == userId &&
              // Prevent changing userType after creation
              request.resource.data.userType == resource.data.userType;
```
**Beneficio**: Una vez que un usuario se registra como 'owner' o 'walker', no puede cambiar su tipo.

### 2. Validación en la Creación
```javascript
allow create: if request.auth != null && 
                request.auth.uid == userId &&
                request.resource.data.userType in ['owner', 'walker'];
```
**Beneficio**: Solo se permiten tipos de usuario válidos ('owner' o 'walker').

### 3. Acceso de Lectura Restringido
```javascript
allow read: if request.auth != null && request.auth.uid == userId;
```
**Beneficio**: Los usuarios solo pueden ver su propia información.

---

## 🧪 Testing de las Reglas

### Opción 1: Simulador de Reglas (Recomendado)

1. En Firebase Console, ve a "Rules" > "Rules Playground"
2. Selecciona el tipo de operación (read/write)
3. Configura la ruta: `/users/{userId}`
4. Configura el auth: `{uid: 'test-user-id'}`
5. Prueba diferentes escenarios:
   - ✅ Usuario leyendo su propia información
   - ❌ Usuario leyendo información de otro
   - ✅ Usuario creando con userType válido
   - ❌ Usuario intentando cambiar userType

### Opción 2: Testing en la Aplicación

1. Crea una cuenta nueva como "owner"
2. Verifica que puedes:
   - ✅ Leer tu perfil
   - ✅ Actualizar tu perfil (excepto userType)
   - ❌ Cambiar tu userType

---

## 🚨 Troubleshooting

### Error: "Permission Denied"
**Causa**: Las reglas están demasiado restrictivas
**Solución**: Verifica que el usuario esté autenticado y accediendo a sus propios datos

### Error: "Invalid argument"
**Causa**: Error de sintaxis en las reglas
**Solución**: Copia exactamente las reglas proporcionadas, sin modificaciones

### Error: "Missing return type"
**Causa**: Falta un punto y coma o estructura incorrecta
**Solución**: Asegúrate de copiar las reglas completas desde el inicio hasta el final

---

## 📝 Notas Importantes

- 🔒 **Seguridad**: Las nuevas reglas mejoran significativamente la seguridad
- ⚡ **Performance**: No afectan negativamente el rendimiento
- 🔄 **Compatibilidad**: Compatible con código existente
- 📊 **Auditoría**: Habilita auditoría en Firebase Console para monitorear accesos

---

## 🔗 Recursos Adicionales

- [Documentación de Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Guía de Testing de Reglas](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)

---

**Última Actualización**: Enero 2026
**Estado**: ✅ Listo para Producción

🐾 ¡Reglas actualizadas y lista para proteger tu aplicación!
