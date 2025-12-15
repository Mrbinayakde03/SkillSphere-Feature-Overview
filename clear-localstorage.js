// Clear localStorage to remove any mock data or stale tokens
// This script should be run in browser console

// Clear all localStorage items
localStorage.clear();

// Alternative: Clear specific items
const itemsToRemove = [
  'token',
  'user',
  'authToken',
  'authUser',
  'skillsphere_token',
  'skillsphere_user'
];

itemsToRemove.forEach(item => {
  localStorage.removeItem(item);
});

console.log('localStorage cleared. You can now refresh the page to see only login/register options.');

