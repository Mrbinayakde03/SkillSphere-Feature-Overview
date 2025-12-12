# 🎓 SkillSphere - Complete Full-Stack Event Management Platform

## 🌟 Project Overview

SkillSphere is a comprehensive AI-powered event management platform designed for educational institutions and organizations. The platform supports three distinct user roles with role-based access control, real-time event discovery, and intelligent recommendations.

## 🎯 Key Features

### 👥 **Three-Role System**
- **Admin**: Platform administration, user management, analytics, organization approvals
- **Organizer**: Event creation and management, member approvals, intra/inter event coordination
- **User**: Event discovery, registration, profile management, skill tracking

### 📅 **Event Management**
- **Inter Events**: Public events visible to all users
- **Intra Events**: Private events for organization members only
- **Registration System**: Automated approval workflow
- **Real-time Analytics**: Participation tracking and insights

### 🔐 **Authentication & Security**
- JWT-based authentication
- Role-based access control (RBAC)
- Password validation and encryption
- Protected API routes
- Session management

### 🏢 **Organization Management**
- Organization verification system
- Member request and approval workflow
- Organization-specific analytics
- Branding and custom profiles

### 📱 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Component library with shadcn/ui
- Mobile-first approach
- Real-time notifications
- Interactive dashboards

## 🏗️ **Technology Stack**

### **Frontend**
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Router 6** - Client-side routing
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Joi** - Input validation
- **Helmet** - Security middleware

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account

### **1. Clone and Setup**
```bash
cd /workspaces/SkillSphere-Feature-Overview/final_year26

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### **2. Environment Configuration**

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SkillSphere
VITE_APP_VERSION=1.0.0
```

**Backend (server/.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://sayan2004:sayan@cluster0.btt7zr9.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### **3. Start the Application**

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend Development:**
```bash
npm run dev
```

### **4. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### **Users**
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/analytics` - User analytics (Admin only)

### **Organizations**
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `POST /api/organizations/:id/join` - Request to join
- `PUT /api/organizations/:id/verify` - Verify organization (Admin only)

### **Events**
- `GET /api/events` - List events (with filters)
- `POST /api/events` - Create event (Organizer only)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration

### **File Upload**
- `POST /api/upload/profile-image` - Upload profile image
- `POST /api/upload/resume` - Upload resume
- `POST /api/upload/organization-docs` - Upload organization documents
- `POST /api/upload/event-media` - Upload event media files
- `DELETE /api/upload/:filename` - Delete uploaded file

## 🔐 **Authentication Flow**

1. **Registration**: Users register with role selection (student/organizer/admin)
2. **Login**: JWT token issued upon successful authentication
3. **Protected Routes**: API endpoints secured with JWT middleware
4. **Role-Based Access**: Different permissions for each user role
5. **Session Management**: Token persistence and automatic refresh

## 🎨 **Frontend Architecture**

### **Component Structure**
```
src/
├── components/
│   ├── shared/          # Shared components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── ui/              # shadcn/ui components
├── layouts/
│   ├── AdminLayout.jsx
│   ├── OrganizerLayout.jsx
│   └── UserLayout.jsx
├── pages/
│   ├── Admin/
│   ├── Organizer/
│   └── User/
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
└── styles/
```

### **State Management**
- **AuthContext**: Global authentication state
- **Local State**: Component-level state with useState
- **API Services**: Centralized API communication

## 🗄️ **Database Schema**

### **Users Collection**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['student', 'organizer', 'admin'],
  college: String,
  year: String,
  profileImage: String,
  skills: [String],
  interests: [String],
  isVerified: Boolean,
  isActive: Boolean,
  organizationRequests: [ObjectId],
  registeredEvents: [ObjectId],
  notifications: [Object]
}
```

### **Organizations Collection**
```javascript
{
  name: String,
  description: String,
  logo: String,
  website: String,
  category: String,
  isVerified: Boolean,
  verificationDocuments: [String],
  members: [ObjectId],
  memberRequests: [ObjectId],
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### **Events Collection**
```javascript
{
  title: String,
  description: String,
  category: String,
  type: ['inter', 'intra'],
  date: Date,
  time: String,
  location: String,
  organizer: ObjectId,
  organization: ObjectId,
  eligibility: [String],
  skills: [String],
  maxParticipants: Number,
  currentParticipants: Number,
  registrationDeadline: Date,
  status: ['draft', 'upcoming', 'ongoing', 'completed'],
  media: [String]
}
```

## 🧪 **Testing**

### **API Testing**
```bash
# Make the test script executable
chmod +x test-api.sh

# Run API tests
./test-api.sh
```

### **Manual Testing**
1. Register users for each role
2. Test login/logout functionality
