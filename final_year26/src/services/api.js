// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000/api';


// Mock data for development
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    college: 'Tech University',
    year: '2024',
    skills: ['JavaScript', 'React', 'Node.js']
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'organizer',
    college: 'Tech University'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint, options = {}) => {
  // In development, simulate API delays and handle gracefully
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Handle auth endpoints with mock data
    if (endpoint === '/auth/me' && options.method === undefined) {
      const token = localStorage.getItem('token');
      if (token) {
        return { data: { user: mockUsers[0] } }; // Return first mock user
      }
    }
    
    if (endpoint === '/auth/login' && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const user = mockUsers.find(u => u.email === body.email);
      if (user) {
        localStorage.setItem('token', 'mock-token');
        return { data: { user, token: 'mock-token' } };
      } else {
        throw new Error('Invalid credentials');
      }
    }
  }
  
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  } catch (error) {
    // In development, if API is not available, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('API not available, using mock data:', error.message);
      
      if (endpoint === '/auth/me') {
        return { data: { user: mockUsers[0] } };
      }
      
      if (endpoint.startsWith('/users')) {
        return { data: mockUsers };
      }
      
      if (endpoint.startsWith('/events')) {
        return { data: [] };
      }
      
      if (endpoint.startsWith('/organizations')) {
        return { data: [] };
      }
      
      // Return empty response for other endpoints
      return { data: {} };
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) => makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getMe: () => makeRequest('/auth/me'),

  updateProfile: (userData) => makeRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),

  changePassword: (passwords) => makeRequest('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(passwords)
  })
};

// User API
export const userAPI = {
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserById: (userId) => makeRequest(`/users/${userId}`),

  updateUser: (userId, userData) => makeRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),

  deleteUser: (userId) => makeRequest(`/users/${userId}`, {
    method: 'DELETE'
  }),

  getUserAnalytics: (period) => makeRequest(`/users/analytics?period=${period}`),

  getUserEvents: () => makeRequest('/events/user/events')
};

// Organization API
export const organizationAPI = {
  getOrganizations: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/organizations${queryString ? `?${queryString}` : ''}`);
  },

  getOrganizationById: (orgId) => makeRequest(`/organizations/${orgId}`),

  createOrganization: (orgData) => makeRequest('/organizations', {
    method: 'POST',
    body: JSON.stringify(orgData)
  }),

  updateOrganization: (orgId, orgData) => makeRequest(`/organizations/${orgId}`, {
    method: 'PUT',
    body: JSON.stringify(orgData)
  }),

  deleteOrganization: (orgId) => makeRequest(`/organizations/${orgId}`, {
    method: 'DELETE'
  }),

  requestToJoin: (orgId) => makeRequest(`/organizations/${orgId}/join`, {
    method: 'POST'
  }),

  manageMemberRequest: (orgId, userId, action) => makeRequest(`/organizations/${orgId}/members/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ action })
  }),

  verifyOrganization: (orgId) => makeRequest(`/organizations/${orgId}/verify`, {
    method: 'PUT'
  }),

  getOrganizationAnalytics: (orgId) => makeRequest(`/organizations/${orgId}/analytics`)
};

// Event API
export const eventAPI = {
  getEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  getEventById: (eventId) => makeRequest(`/events/${eventId}`),

  createEvent: (eventData) => makeRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),

  updateEvent: (eventId, eventData) => makeRequest(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  }),

  deleteEvent: (eventId) => makeRequest(`/events/${eventId}`, {
    method: 'DELETE'
  }),

  registerForEvent: (eventId) => makeRequest(`/events/${eventId}/register`, {
    method: 'POST'
  }),

  cancelRegistration: (eventId) => makeRequest(`/events/${eventId}/register`, {
    method: 'DELETE'
  }),

  getEventRegistrations: (eventId) => makeRequest(`/events/${eventId}/registrations`),

  manageRegistration: (eventId, registrationId, status) => makeRequest(`/events/${eventId}/registrations/${registrationId}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),

  getEventAnalytics: (eventId) => makeRequest(`/events/${eventId}/analytics`)
};

// Upload API
export const uploadAPI = {
  uploadProfileImage: (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profileImage', file);

    return fetch(`${API_BASE_URL}/upload/profile-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    }).then(handleResponse);
  },

  uploadResume: (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('resume', file);

    return fetch(`${API_BASE_URL}/upload/resume`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    }).then(handleResponse);
  },

  uploadOrganizationDocs: (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('documents', file);

    return fetch(`${API_BASE_URL}/upload/organization-docs`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    }).then(handleResponse);
  },

  uploadEventMedia: (files) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    files.forEach(file => {
      formData.append('media', file);
    });

    return fetch(`${API_BASE_URL}/upload/event-media`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    }).then(handleResponse);
  },

  deleteFile: (filename) => makeRequest(`/upload/${filename}`, {
    method: 'DELETE'
  })
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default {
  authAPI,
  userAPI,
  organizationAPI,
  eventAPI,
  uploadAPI,
  setAuthToken,
  getAuthToken,
  clearAuthData
};
