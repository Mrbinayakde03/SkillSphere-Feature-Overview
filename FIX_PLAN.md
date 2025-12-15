# SkillSphere Fix Plan

## Issues to Address:

### 1. API Issues
- Fix query parameter handling for events endpoint
- Handle `?organizer=undefined&limit=50` parameters

### 2. Event Types Implementation
- Create Inter Events (visible to everyone)
- Create Intra Events (visible only to organization members)
- Update frontend to show both event types with proper filtering

### 3. Organization Dashboard Issues
- Fix missing header in organization dashboard
- Add proper CSS styling
- Create event functionality (Inter vs Intra options)

### 4. User Dashboard Enhancements
- Add organization search functionality
- Add join request functionality
- Allow user registration for Inter events
- Add proper CSS styling

### 5. CSS Issues
- Remove Tailwind CSS dependency
- Use only normal CSS
- Fix header overlapping issues
- Style dashboard pages
- Style event pages

### 6. Navigation & Routing
- Fix create event routes
- Ensure proper page routing

## Implementation Steps:

1. Fix API query parameter handling
2. Update event models and controllers for Inter/Intra types
3. Create missing CSS files for all pages
4. Fix organization dashboard layout and header
5. Update user dashboard with search and join functionality
6. Fix create event functionality
7. Resolve header overlapping issues
8. Test all functionality

## Expected Outcomes:
- Fully functional event creation with Inter/Intra options
- Proper organization management
- Working user dashboard with organization search
- Clean CSS styling without Tailwind
- Fixed header and navigation
- All API endpoints working correctly

