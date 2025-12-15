# SkillSphere Implementation Plan

## Issues Identified

### 1. White Page Issue After Registration
- **Problem**: Inconsistent data structure between frontend and backend
- **Root Cause**: 
  - Frontend sends `fullName` but backend expects `name`
  - User model requires `college` for all users, but organizers don't provide it
  - Role mapping inconsistency between frontend (`user`/`organizer`) and backend (`student`/`organizer`)
  - Navigation after successful registration may fail

### 2. Organization Event Creation Missing
- **Problem**: No UI for organizers to create events
- **Current State**: Backend has Event model and controller, but frontend lacks event creation interface
- **Required**: Create event creation form and display events on home page

## Implementation Plan

### Phase 1: Fix Registration Issues
1. **Update Backend Auth Controller**
   - Fix field name mapping (`fullName` → `name`)
   - Handle different user types (student vs organizer)
   - Make college optional for organizers
   - Fix role mapping

2. **Update User Model**
   - Make college optional
   - Add organization-specific fields
   - Update validation rules

3. **Fix Frontend Registration Flow**
   - Ensure proper navigation after registration
   - Fix role-based routing
   - Handle success/error states properly

### Phase 2: Implement Organization Event Creation
1. **Create Event Creation Interface**
   - Build CreateEventModal component
   - Add form validation
   - Handle file uploads for event images

2. **Update Organizer Dashboard**
   - Add event creation button
   - Display organizer's events
   - Manage event details

3. **Update Home Page**
   - Connect to real event API
   - Display events from database
   - Maintain search and filter functionality

### Phase 3: Backend Integration
1. **Event Controller Updates**
   - Add event creation endpoints
   - Handle file uploads
   - Add event retrieval with filters

2. **Database Schema Updates**
   - Ensure Event model supports all fields
   - Link events to organizations
   - Add proper indexing

## Expected Outcomes
- ✅ Registration works without white page
- ✅ Organizers can create and manage events
- ✅ Events appear on home page
- ✅ Proper role-based access control
- ✅ File upload functionality working

## Files to Modify
- `/server/controllers/authController.js`
- `/server/models/User.js`
- `/server/controllers/eventController.js`
- `/server/models/Event.js`
- `/src/components/Auth/RegisterPage.jsx`
- `/src/contexts/AuthContext.jsx`
- `/src/components/OrganizerDashboard.jsx`
- `/src/components/CreateEventModal.jsx`
- `/src/pages/HomePage.jsx`
- `/src/services/api.js`
