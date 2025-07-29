# Amigo Perro 🐾 - Dog Walking App

A professional web application for connecting dog owners with reliable dog walkers in Mexico City. Built with modern web technologies and Firebase integration.

## Features

### 🏠 **Home Page**
- Modern, responsive hero section
- Professional navigation with mobile menu
- Call-to-action buttons for registration and login

### 👥 **User Registration**
- **Dog Owner Registration**: Complete profile with dog information
- **Walker Registration**: Professional walker profiles with experience and zones
- **Free Connection Service**: No fees, no commissions - just connecting people

### 🔐 **Authentication System**
- Secure Firebase Authentication
- User type verification (Owner/Walker/Admin)
- Session management and logout functionality

### 📱 **Dashboard System**
- **Owner Dashboard**: Manage dogs, view scheduled walks, and walk history
- **Walker Dashboard**: View pending walks, active walks, and complete walk history

### 🐕 **Dog Management**
- Add and manage multiple dogs per owner
- Store breed, age, allergies, and additional information
- Edit dog profiles

### 🚶‍♂️ **Walk Management**
- Schedule walks between owners and walkers
- Real-time walk status tracking (pending, active, completed)
- Walk duration tracking and history

### 📞 **WhatsApp Integration**
- Direct WhatsApp contact button
- Automated walk notifications to owners and walkers
- Real-time communication during walks

### 📊 **Platform Features**
- User ratings and reviews
- WhatsApp integration for direct communication
- Real-time walk tracking
- Mobile-optimized interface

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore Database)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins)
- **Responsive Design**: Mobile-first approach

## Setup Instructions

### 1. Firebase Configuration

The app is already configured with your Firebase credentials:
- Project ID: `amigo-perro-bf18c`
- Authentication enabled
- Firestore Database enabled

### 2. Admin User Setup

To create the admin user, run the admin setup script:

```bash
# Open admin-setup.js in a browser or run it once
# This will create the admin user with:
# Email: admin@amigoperro.com
# Password: admin123456
```

### 3. File Structure

```
amigoperro/
├── index.html          # Main application file
├── styles.css          # Professional styling
├── script.js           # Main application logic
├── admin-setup.js      # Admin user creation script
└── README.md           # This file
```

### 4. Running the Application

1. Open `index.html` in a web browser
2. The app will automatically load and show the home page
3. Users can register as owners or walkers
4. Admin can access the dashboard using the provided credentials

## User Types and Access

### 🐕 **Dog Owners**
- Register with personal and dog information
- Add multiple dogs to their profile
- View scheduled walks and walk history
- Contact walkers through WhatsApp

### 🚶‍♂️ **Dog Walkers**
- Register with experience and work zones
- View pending and active walks
- Start and end walks with real-time tracking
- Complete walk history and earnings

## Key Features

### 🔒 **Security**
- Firebase Authentication for secure user management
- User type verification
- Secure data storage in Firestore

### 📱 **Mobile Responsive**
- Optimized for all device sizes
- Touch-friendly interface
- Mobile navigation menu

### 🎨 **Professional Design**
- Modern, clean interface
- Consistent color scheme
- Smooth animations and transitions
- Professional typography

### ⚡ **Real-time Updates**
- Live walk status updates
- Real-time notifications
- Instant data synchronization

## WhatsApp Integration

The app includes comprehensive WhatsApp integration:

- **Floating Contact Button**: Direct access to customer service
- **Walk Notifications**: Automated messages to owners and walkers
- **Real-time Updates**: Live walk progress updates
- **Customer Support**: Direct line to Amigo Perro team

## Service Model

- **Free Connection**: No fees for users
- **Direct Communication**: Users connect directly via WhatsApp
- **No Commissions**: We don't take any percentage from transactions
- **Community Focus**: Building a trusted community of dog lovers

## Database Collections

The app uses the following Firestore collections:

- **users**: User profiles (owners, walkers, admin)
- **dogs**: Dog information linked to owners
- **walks**: Walk scheduling and tracking data

## Customization

### Colors
The app uses CSS variables for easy customization:
```css
:root {
    --primary-color: #1c7d54;
    --secondary-color: #b6956a;
    --accent-color: #25D366;
}
```

### Content
- Update contact information in the HTML
- Modify WhatsApp number in the JavaScript
- Customize admin credentials in admin-setup.js

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance

- Optimized for fast loading
- Minimal external dependencies
- Efficient Firebase queries
- Responsive image handling

## Future Enhancements

- Payment integration
- GPS tracking for walks
- Photo sharing during walks
- Rating and review system
- Push notifications
- Advanced scheduling system

## Support

For technical support or questions:
- WhatsApp: +52 55 2720 4437
- Email: info@amigoperro.com
- Instagram: @amigo.perro.cdmx

---

**Amigo Perro** - Connecting dog lovers with reliable walkers in Mexico City 🐾 