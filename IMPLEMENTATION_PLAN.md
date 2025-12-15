# SkillSphere Feature Implementation Plan

## 📋 Current Analysis

### Existing Codebase Review:
- **Backend**: Node.js + Express + MongoDB (models, controllers, routes exist)
- **Frontend**: React + React Router (layouts, components exist)
- **Database**: MongoDB Atlas (already connected)

### Current Role System:
- Roles: 'student', 'organizer', 'admin' 
- Need to change to: 'USER', 'ORGANIZATION'

## 🎯 Implementation Plan

### Phase 1: Backend Modifications

#### 1.1 Update User Model
- Change role enum from ['student', 'organizer', 'admin'] to ['USER', 'ORGANIZATION']
- Add `joinedOrganizations` array field
- Update registration logic

#### 1.2 Update Organization Model
- Add `adminUserId` field (reference to User)
- Simplify members array to just store user IDs
- Add `createdAt` field

#### 1.3 Update Event Model
- Add `organizationId` field (reference to Organization)
- Ensure type field supports 'INTER' and 'INTRA' values

#### 1.4 Create JoinRequest Model
```javascript
{
  userId: ObjectId,
  organizationId: ObjectId,
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  createdAt: Date
}
```

#### 1.5 Update Auth Controller
- Update register logic for new role system
- Update login redirect logic
- Handle role-based token generation

#### 1.6 Create Organization Controller
- Create organization endpoint
- Join request endpoints (send, accept, reject)
- Organization membership management

#### 1.7 Update Event Controller
- Add organization-based event filtering
- Inter/Intra event separation logic

### Phase 2: Backend API Endpoints

#### 2.1 Authentication APIs (Update)
- `POST /api/auth/register` - Update for USER/ORGANIZATION roles
- `POST /api/auth/login` - Update redirect logic

#### 2.2 Organization APIs (New/Create)
- `POST /api/organizations` - Create organization
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get organization details
- `POST /api/organizations/:id/join` - Send join request
- `GET /api/organizations/:id/members` - Get members (admin only)
- `PUT /api/organizations/:id/requests/:userId` - Accept/reject requests

#### 2.3 Event APIs (Update)
- `GET /api/events/inter` - Get all INTER events
- `GET /api/events/intra` - Get INTRA events (authorized users only)
- `POST /api/events` - Create event with organizationId
- `PUT /api/events/:id` - Update event

### Phase 3: Frontend Modifications

#### 3.1 Update Authentication Context
- Handle new role system
- Update token storage and retrieval

#### 3.2 Update App.jsx Routing
- Change role checks from 'student'/'organizer' to 'USER'/'ORGANIZATION'
- Update dashboard routes: `/dashboard/user`, `/dashboard/organization`

#### 3.3 Create User Dashboard
- Public (Inter) Events section
- Organization List section
- Join Request Status
- Intra Events (for member organizations)

#### 3.4 Create Organization Dashboard
- Event Management (Create/Edit/Delete)
- Membership Requests management
- Organization details

#### 3.5 Update Navigation & Components
- Role-based navigation
- Update existing components for new role system

### Phase 4: Integration & Testing

#### 4.1 Database Migration
- Update existing user roles
- Create organization records for existing organizers
- Update existing events with organization references

#### 4.2 API Testing
- Test all new endpoints
- Verify authentication & authorization
- Test role-based access control

#### 4.3 Frontend Testing
- Test user flows
- Verify dashboard functionality
- Test role-based route protection

## 🗂️ Files to Modify/Create

### Backend Files to Modify:
1. `Backend/server/models/User.js` - Update role enum
2. `Backend/server/models/Organization.js` - Simplify structure
3. `Backend/server/models/Event.js` - Add organizationId
4. `Backend/server/models/JoinRequest.js` - Create new model
5. `Backend/server/controllers/authController.js` - Update for new roles
6. `Backend/server/controllers/organizationController.js` - Create/Update
7. `Backend/server/controllers/eventController.js` - Update filtering
8. `Backend/server/routes/organizations.js` - Create/Update routes
9. `Backend/server/routes/auth.js` - Update auth routes

### Frontend Files to Modify:
1. `final_year26/src/contexts/AuthContext.jsx` - Update role handling
2. `final_year26/src/App.jsx` - Update routing
3. `final_year26/src/pages/User/Dashboard.jsx` - Update/rewrite
4. `final_year26/src/pages/Organizer/Dashboard.jsx` - Update/rewrite
5. `final_year26/src/components/` - Update navigation components

### New Frontend Files to Create:
1. `final_year26/src/pages/Organization/Dashboard.jsx` - Organization admin dashboard
2. `final_year26/src/layouts/OrganizationLayout.jsx` - Organization layout
3. `final_year26/src/components/OrganizationJoin.jsx` - Join request component
4. `final_year26/src/components/EventManagement.jsx` - Event CRUD component

## 🚀 Expected Outcome

After implementation:
- ✅ JWT authentication with USER/ORGANIZATION roles
- ✅ Role-based dashboard routing
- ✅ Organization creation and membership system
- ✅ Event management (Inter/Intra separation)
- ✅ Join request workflow
- ✅ Secure API endpoints with proper authorization
- ✅ Clean, responsive UI for both user types
- ✅ Mobile-friendly design
