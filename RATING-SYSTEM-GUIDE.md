# Rating System Guide - Amigo Perro

## Overview
The rating system is now fully integrated into the Amigo Perro platform, providing an Uber-like experience where users can rate each other after completing walks.

## Features

### 🎯 Core Features
- **5-Star Rating System**: All users start with 5.0 stars
- **Bidirectional Ratings**: Both owners and walkers can rate each other
- **Rating Display**: Shows average rating and number of reviews
- **Confirmation Workflow**: Walkers must confirm with owners before starting walks
- **Rating Prompts**: Automatic prompts to rate after walk completion

### 🔄 Workflow
1. **Walker accepts walk** → Must contact owner to confirm
2. **Owner confirms** → Walker can start the walk
3. **Walk starts** → Both parties can track progress
4. **Walk ends** → Both parties can rate each other
5. **Ratings update** → User profiles show updated ratings

## Database Structure

### Users Collection
```javascript
{
  uid: "user_id",
  name: "User Name",
  email: "user@email.com",
  userType: "owner" | "walker",
  // Rating fields
  averageRating: 5.0,
  totalRatings: 0,
  ratingCount: 0
}
```

### Ratings Collection
```javascript
{
  raterId: "user_who_rated",
  raterName: "Rater Name",
  ratedUserId: "user_being_rated",
  ratedUserName: "Rated User Name",
  walkId: "walk_id",
  rating: 5, // 1-5 stars
  comment: "Optional comment",
  createdAt: timestamp
}
```

### Walks Collection
```javascript
{
  // ... existing fields
  status: "pending" | "accepted" | "confirmed" | "active" | "completed" | "cancelled",
  canRate: true, // Added for rating system
  ownerRating: 5.0, // Owner's average rating
  walkerRating: 5.0 // Walker's average rating
}
```

## Functions Added

### Global Functions (window.*)
- `acceptWalk(walkId)` - Walker accepts a walk
- `confirmWalkWithOwner(walkId)` - Walker confirms with owner
- `startWalk(walkId)` - Start the walk
- `endWalk(walkId)` - End walk with rating prompt
- `cancelWalk(walkId)` - Cancel walk
- `rateUser(userId, userName, walkId)` - Rate another user

### Rating System Functions
- `updateUserAverageRating(userId)` - Recalculate user's average rating
- `getUserRating(userId)` - Get user's current rating
- `displayUserRating(userId, containerId)` - Display rating in UI
- `completeWalkWithRating(walkId)` - Complete walk with rating
- `rateUserEnhanced(userId, userName, walkId)` - Enhanced rating with validation

## Firebase Indexes Required

To avoid index errors, create these indexes in Firebase Console:

### Walks Collection
1. `walkerId` (ASC) + `status` (ASC) + `date` (DESC)
2. `status` (ASC) + `walkerId` (ASC) + `date` (DESC)

### Ratings Collection
1. `ratedUserId` (ASC) + `createdAt` (DESC)
2. `raterId` (ASC) + `ratedUserId` (ASC) + `walkId` (ASC)

## Setup Instructions

### 1. Update Firestore Rules
Copy the updated rules from `firestore-rules.txt` to your Firebase Console.

### 2. Create Indexes
Go to Firebase Console > Firestore Database > Indexes and create the indexes listed above.

### 3. Test the System
1. Register as both an owner and walker
2. Create a walk as owner
3. Accept walk as walker
4. Confirm with owner
5. Start and complete walk
6. Test rating system

## Error Handling

### Index Errors
If you see index errors, the system will:
- Use simplified queries without `orderBy`
- Sort results manually in JavaScript
- Show error messages to users

### Rating Validation
- Users can only rate once per walk
- Ratings must be 1-5 stars
- Comments are optional
- Duplicate ratings are prevented

## UI Improvements

### Rating Display
- Shows average rating with stars
- Displays number of reviews
- Updates in real-time

### Confirmation Workflow
- Clear buttons for each step
- WhatsApp integration for communication
- Status indicators for walk progress

## Security Features

### Rating Security
- Users can only rate walks they participated in
- Users can only read ratings they gave or received
- Admins can read all ratings
- No duplicate ratings allowed

### Walk Security
- Only participants can modify walks
- Status changes are validated
- Contact information is protected

## Testing Checklist

- [ ] Owner registration with default 5.0 rating
- [ ] Walker registration with default 5.0 rating
- [ ] Walk creation and acceptance
- [ ] Owner-walker confirmation workflow
- [ ] Walk start and completion
- [ ] Rating prompts after walk completion
- [ ] Rating display in user profiles
- [ ] Average rating calculations
- [ ] Rating history display
- [ ] Error handling for index issues

## Troubleshooting

### Common Issues
1. **Index Errors**: Create required indexes in Firebase Console
2. **Rating Not Showing**: Check if user has rating data
3. **Confirmation Not Working**: Ensure walk status is correct
4. **Rating Duplicates**: System prevents multiple ratings per walk

### Debug Steps
1. Check browser console for errors
2. Verify Firebase rules are updated
3. Confirm indexes are created
4. Test with different user types

## Future Enhancements

- Rating filters and sorting
- Rating analytics for admins
- Rating notifications
- Rating disputes system
- Advanced rating criteria (punctuality, communication, etc.) 