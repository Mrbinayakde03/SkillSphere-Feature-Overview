p#!/bin/bash

echo "🧪 Testing SkillSphere Registration System"
echo "========================================"

# Test registration endpoint
echo "Testing User Registration..."

# Student registration
echo "📝 Testing Student Registration..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "student@test.com",
    "password": "password123",
    "role": "student",
    "college": "Tech University",
    "year": "2024",
    "skills": ["JavaScript", "React"],
    "educationLevel": "undergraduate",
    "interests": ["Web Development"]
  }' | jq '.'

echo -e "\n" 

# Organizer registration
echo "📝 Testing Organizer Registration..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Organizer",
    "email": "organizer@test.com",
    "password": "password123",
    "role": "organizer",
    "organizationName": "Tech Events Inc",
    "organizationType": "tech",
    "organizationDescription": "Technology event management company",
    "officialEmailDomain": "techevents.com"
  }' | jq '.'

echo -e "\n"

# Test login endpoint
echo "🔐 Testing Login..."
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }' | jq '.'

echo -e "\n✅ Registration tests completed!"

