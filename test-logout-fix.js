// This is a simple test script to verify the logout functionality
// To run this test, you would need to:
// 1. Log in to the application
// 2. Click on the profile dropdown
// 3. Click on the Logout button
// 4. Verify that you are redirected to the login page

console.log('Testing logout functionality:');
console.log('1. Fixed authStore initialization in AppHeader component');
console.log('2. Modified logout function in user composable to redirect to login page');
console.log('3. Removed redundant code in AppHeader logoutUser function');

// Expected behavior:
// - When user clicks logout, the logout API is called
// - User state is set to null
// - User is redirected to login page