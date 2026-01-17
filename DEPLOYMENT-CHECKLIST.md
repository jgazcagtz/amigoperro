# 🚀 DEPLOYMENT CHECKLIST - AMIGO PERRO

## ✅ **PRE-DEPLOYMENT (Complete Before Going Live)**

### **1. Firebase Configuration** ⚠️ CRITICAL
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Select your project: `amigo-perro-bf18c`
- [ ] Navigate to **Firestore Database** → **Rules**
- [ ] Copy contents from `firestore-rules.txt`
- [ ] Paste and **Publish** new rules
- [ ] Verify rules are active (check "Published" timestamp)

### **2. Firebase Authentication**
- [ ] Enable Email/Password authentication
- [ ] Enable Google Sign-In provider
- [ ] Add authorized domain (your production domain)
- [ ] Configure OAuth consent screen

### **3. Firebase Indexes** (Optional but Recommended)
- [ ] Go to **Firestore Database** → **Indexes**
- [ ] Create composite index for walks: `ownerId`, `status`, `date`
- [ ] Create composite index for ratings: `ratedUserId`, `createdAt`
- [ ] Firebase will auto-create when queries are run

### **4. File Upload**
Upload these files to your web host:
- [ ] `index.html`
- [ ] `script.js`
- [ ] `styles.css`
- [ ] `privacy.html`
- [ ] `terms.html`
- [ ] Any images or assets

### **5. Testing Environment Setup**
- [ ] Test on staging URL first
- [ ] Create test user accounts (owner & walker)
- [ ] Add test dog profiles
- [ ] Test all features before production

---

## 🧪 **TESTING CHECKLIST (Test Each Feature)**

### **Core Features:**
- [ ] User registration (Owner)
- [ ] User registration (Walker)
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Logout functionality
- [ ] Dashboard loads correctly

### **Dog Management:**
- [ ] Add new dog profile
- [ ] View dog list
- [ ] Edit dog information
- [ ] Dog appears in all dropdowns

### **Walk Scheduling:**
- [ ] Schedule a walk
- [ ] View scheduled walks
- [ ] Cancel a walk
- [ ] Walker accepts walk
- [ ] Walker starts walk
- [ ] Complete walk
- [ ] Rating system works

### **🆕 Guardería Feature:**
- [ ] Open guardería modal from dashboard
- [ ] Select dog from dropdown
- [ ] Choose date (validates min: today)
- [ ] Select time slot (Medio Día / Día Completo)
- [ ] Select zone (CDMX neighborhoods)
- [ ] Add special notes
- [ ] Submit booking
- [ ] Success notification appears
- [ ] Data saves to Firebase `guarderias` collection
- [ ] Modal closes after submit
- [ ] Form resets properly

### **🆕 Play Date Feature:**
- [ ] Open play date modal from dashboard
- [ ] Select dog from dropdown
- [ ] Choose preferred size match
- [ ] Select energy level
- [ ] Choose date (validates min: today)
- [ ] Set time preference
- [ ] Select zone (CDMX neighborhoods)
- [ ] Add compatibility description
- [ ] Submit request
- [ ] Success notification appears
- [ ] Data saves to Firebase `playdates` collection
- [ ] Modal closes after submit
- [ ] Form resets properly

### **Navigation:**
- [ ] All menu links work
- [ ] Section transitions smooth
- [ ] Mobile menu opens/closes
- [ ] "Iniciar Sesión" button present on hero
- [ ] All footer links work

### **WhatsApp Integration:**
- [ ] WhatsApp button visible (bottom right)
- [ ] Click opens WhatsApp with correct number
- [ ] Message pre-filled correctly
- [ ] All service buttons trigger WhatsApp
- [ ] Contact forms redirect to WhatsApp

---

## 📱 **MOBILE TESTING (Test on Real Devices)**

### **iOS (iPhone/iPad):**
- [ ] Safari browser
- [ ] Chrome browser
- [ ] Touch targets work (44px minimum)
- [ ] Modals display correctly
- [ ] Forms don't zoom on focus
- [ ] Safe areas respected
- [ ] WhatsApp button positioned correctly

### **Android:**
- [ ] Chrome browser
- [ ] Forms work smoothly
- [ ] Modals responsive
- [ ] Touch interactions smooth
- [ ] Back button behavior correct

### **Responsive Breakpoints:**
- [ ] Desktop: 1920px, 1440px, 1024px
- [ ] Tablet: 768px
- [ ] Mobile: 480px, 375px, 320px
- [ ] Landscape orientation works

---

## 🔒 **SECURITY VERIFICATION**

### **Firestore Rules:**
- [ ] Users can only read/write their own data
- [ ] Anonymous users blocked from database
- [ ] Guardería bookings protected by ownerId
- [ ] Play date requests protected by ownerId
- [ ] Admin access working (if applicable)

### **Authentication:**
- [ ] Password requirements enforced (min 6 chars)
- [ ] Email validation working
- [ ] Google OAuth secure
- [ ] Session persistence working
- [ ] Logout clears session

### **Data Privacy:**
- [ ] Privacy policy accessible
- [ ] Terms & conditions accessible
- [ ] LFPDPPP compliance checkbox
- [ ] User consent recorded
- [ ] Phone numbers not exposed

---

## 🎨 **SEO & MARKETING CHECKS**

### **Meta Tags:**
- [ ] Page title displays correctly
- [ ] Meta description shows in search
- [ ] OG tags for social sharing
- [ ] Twitter cards working
- [ ] Favicon displays

### **Google Search Console:**
- [ ] Submit sitemap
- [ ] Verify ownership
- [ ] Monitor indexing status

### **Local SEO (CDMX):**
- [ ] Google Business Profile created
- [ ] Location: Condesa, Roma, Del Valle mentioned
- [ ] CDMX keywords in content
- [ ] Phone number: 55-27-20-44-37 correct

---

## 🌐 **BROWSER COMPATIBILITY**

Test in these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Mobile Chrome (Android 10+)

---

## 📊 **ANALYTICS SETUP** (Optional)

- [ ] Google Analytics configured
- [ ] Firebase Analytics enabled
- [ ] Track button clicks
- [ ] Track form submissions
- [ ] Track WhatsApp conversions
- [ ] Monitor user journeys

---

## ⚠️ **CRITICAL ISSUES TO WATCH**

### **Firebase Limits (Free Tier):**
- Reads: 50,000/day
- Writes: 20,000/day
- Deletes: 20,000/day
- Monitor usage in Firebase Console

### **Common Issues:**
1. **Firestore rules not updated** → Users can't save data
2. **Authentication not enabled** → Users can't register
3. **Incorrect API keys** → Firebase connection fails
4. **CORS issues** → Enable proper domains in Firebase

### **If Issues Occur:**
1. Open browser console (F12)
2. Check for error messages
3. Verify Firebase connection
4. Check Firestore rules
5. Verify authentication is enabled

---

## ✅ **LAUNCH DAY CHECKLIST**

### **Morning of Launch:**
- [ ] Final test of all features
- [ ] Verify Firestore rules are published
- [ ] Check Firebase quota remaining
- [ ] Test WhatsApp integration
- [ ] Verify phone number correct: 55-27-20-44-37
- [ ] Test on multiple devices

### **After Launch:**
- [ ] Monitor Firebase Console for errors
- [ ] Check user registrations working
- [ ] Verify data saving to collections
- [ ] Monitor WhatsApp messages
- [ ] Respond to first customers quickly

### **First Week:**
- [ ] Daily Firebase usage check
- [ ] Read user feedback
- [ ] Fix any reported bugs
- [ ] Monitor conversion rates
- [ ] Test guardería/play date bookings

---

## 🆘 **SUPPORT & TROUBLESHOOTING**

### **If Guardería/Play Dates Not Working:**

1. **Check Browser Console:**
   - Press F12 to open developer tools
   - Look for error messages in Console tab
   - Common errors: "Permission denied" (Firestore rules issue)

2. **Verify Firebase Collections:**
   - Go to Firebase Console → Firestore Database
   - Check if `guarderias` and `playdates` collections exist
   - If not, they'll be created on first submission

3. **Test Firestore Rules:**
   ```javascript
   // In browser console, test if you can write:
   console.log(auth.currentUser); // Should show user object
   // If null, authentication failed
   ```

4. **Form Not Submitting:**
   - Check if dog dropdown has options (need to add dogs first)
   - Verify date is today or future
   - Check browser console for errors

### **Quick Fixes:**

**Issue:** "Dogs list is empty"  
**Fix:** Add a dog profile first from dashboard

**Issue:** "Modal won't close"  
**Fix:** Click X button or background, check console for errors

**Issue:** "Data not saving"  
**Fix:** Verify Firestore rules are published and user is authenticated

**Issue:** "WhatsApp not opening"  
**Fix:** Verify phone number: 55-27-20-44-37, check if WhatsApp installed

---

## 🎉 **POST-LAUNCH SUCCESS METRICS**

Track these KPIs:
- [ ] User registrations (target: 50+ in first month)
- [ ] Dog profiles created
- [ ] Walk bookings (main feature)
- [ ] Guardería bookings (new!)
- [ ] Play date requests (new!)
- [ ] WhatsApp conversions
- [ ] Repeat customers

---

## 📞 **EMERGENCY CONTACTS**

**Firebase Status:** https://status.firebase.google.com  
**Firebase Support:** https://firebase.google.com/support  

**Technical Issues:**
- Check browser console first
- Review Firestore rules
- Verify authentication enabled
- Test with different browsers/devices

---

**Deployment Guide Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** ✅ Ready for Production

**Good luck with your launch! 🚀🐾**
