// Test authentication and role checking
console.log('Current localStorage data:');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Parse user data if available
const userData = localStorage.getItem('user');
if (userData) {
  try {
    const user = JSON.parse(userData);
    console.log('Parsed user:', user);
    console.log('User role:', user.role);
    console.log('Is ORGANIZATION role?', user.role && user.role.toLowerCase() === 'organization');
  } catch (e) {
    console.log('Error parsing user data:', e);
  }
} else {
  console.log('No user data found in localStorage');
}

// Check if user is on the correct page
console.log('Current URL:', window.location.href);
console.log('Should be on organizer events page for testing add events functionality');
