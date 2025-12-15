

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000/api';

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
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};


// Authentication API
export const authAPI = {

  register: async (userData) => {
    try {

      // Map frontend fields to backend format with proper defaults
      const backendData = {
        name: userData.fullName || userData.name || '',
        email: userData.email || '',
        password: userData.password || '',
        role: (userData.role || 'USER').toUpperCase(),
        college: userData.college || null,
        year: userData.year || null,
        skills: userData.skills || [],
        educationLevel: userData.educationLevel || null,
        interests: userData.interests || [],
        organizationName: userData.organizationName || null,
        organizationType: userData.organizationType || null,
        organizationDescription: userData.organizationDescription || null,
        officialEmailDomain: userData.officialEmailDomain || null
      };

      console.log('Frontend registration data:', userData);
      console.log('Backend registration data:', backendData);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok && data.success) {
        // Store the token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        return data;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

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


  getOrganizationAnalytics: (orgId) => makeRequest(`/organizations/${orgId}/analytics`),

  getUserOrganizations: () => makeRequest('/organizations/user/my-organizations')
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
  // Also clear any other auth-related items
  Object.keys(localStorage).forEach(key => {
    if (key.includes('auth') || key.includes('user') || key.includes('token')) {
      localStorage.removeItem(key);
    }
  });
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
