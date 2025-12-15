// In-memory database for development
// This can be easily replaced with MongoDB later

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class MockDatabase {
  constructor() {
    this.users = [];
    this.events = [];
    this.organizations = [];
    this.registrations = [];
    this._generateIds = {
      users: 1,
      events: 1,
      organizations: 1,
      registrations: 1
    };
  }

  // User methods
  async createUser(userData) {
    const id = this._generateIds.users++;
    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const user = {
      _id: id.toString(),
      name: userData.name,
      email: userData.email,
      password: passwordHash,
      role: userData.role,
      college: userData.college || null,
      year: userData.year || null,
      skills: userData.skills || [],
      interests: userData.interests || [],
      educationLevel: userData.educationLevel || null,
      organizationName: userData.organizationName || null,
      organizationType: userData.organizationType || null,
      organizationDescription: userData.organizationDescription || null,
      officialEmailDomain: userData.officialEmailDomain || null,
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserById(id) {
    return this.users.find(user => user._id === id.toString());
  }

  // Event methods
  async createEvent(eventData) {
    const id = this._generateIds.events++;
    
    const event = {
      _id: id.toString(),
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      maxParticipants: eventData.maxParticipants || 50,
      currentParticipants: 0,
      skills: eventData.skills || [],
      organizer: eventData.organizer,
      organizerEmail: eventData.organizerEmail,
      organizerId: eventData.organizerId,
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.events.push(event);
    return event;
  }

  async getEvents(filters = {}) {
    let filteredEvents = [...this.events];

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      filteredEvents = filteredEvents.filter(event => event.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    return filteredEvents;
  }

  async getEventById(id) {
    return this.events.find(event => event._id === id.toString());
  }

  async getEventsByOrganizer(organizerId) {
    return this.events.filter(event => event.organizerId === organizerId);
  }

  // Registration methods
  async registerForEvent(userId, eventId) {
    // Check if already registered
    const existingRegistration = this.registrations.find(
      reg => reg.userId === userId.toString() && reg.eventId === eventId.toString()
    );

    if (existingRegistration) {
      throw new Error('Already registered for this event');
    }

    const registration = {
      _id: this._generateIds.registrations++,
      userId: userId.toString(),
      eventId: eventId.toString(),
      status: 'registered',
      registrationDate: new Date()
    };

    this.registrations.push(registration);

    // Update event participant count
    const event = this.events.find(e => e._id === eventId.toString());
    if (event) {
      event.currentParticipants++;
    }

    return registration;
  }

  async getUserRegistrations(userId) {
    return this.registrations.filter(reg => reg.userId === userId.toString());
  }

  // Compare password method
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

// Create singleton instance
const mockDB = new MockDatabase();

export default mockDB;
