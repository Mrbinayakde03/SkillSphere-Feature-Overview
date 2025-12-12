#!/bin/bash

# SkillSphere API Testing Script
echo "🧪 Testing SkillSphere Backend API..."

# Test server health
echo "1. Testing server health..."
curl -s http://localhost:5000/health

echo -e "\n\n2. Testing user registration..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Admin","email":"admin@example.com","password":"AdminPass123","role":"admin","college":"SkillSphere University","year":"Staff"}'

echo -e "\n\n3. Testing user registration (organizer)..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Organizer","email":"organizer@example.com","password":"OrganizerPass123","role":"organizer","college":"Tech University","year":"Staff"}'

echo -e "\n\n4. Testing user login..."
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

echo -e "\n\n✅ API testing completed!"
echo "🎯 Note: Store the JWT token from login response for authenticated requests"
