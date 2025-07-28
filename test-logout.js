// Test script to verify logout functionality
// This would be run in the browser console

const testLogout = async () => {
  console.log("Testing logout functionality:");
  
  try {
    // Assuming we have access to the Vue app instance
    const app = document.querySelector('#app').__vue_app__;
    const authStore = app._instance.appContext.provides.authStore;
    
    console.log("Current authentication state:", authStore.isAuthenticated);
    
    // Simulate logout
    console.log("Attempting logout...");
    await authStore.logoutUser();
    
    console.log("Logout completed");
    console.log("Authentication state after logout:", authStore.isAuthenticated);
    
    // Check if local storage was cleared
    const userInStorage = localStorage.getItem('user');
    const roleInStorage = localStorage.getItem('userRole');
    
    console.log("User in localStorage:", userInStorage);
    console.log("Role in localStorage:", roleInStorage);
    
    if (!authStore.isAuthenticated && !userInStorage && !roleInStorage) {
      console.log("✅ Logout successful - all state cleared properly");
    } else {
      console.log("❌ Logout may have issues - some state remains");
    }
    
    // Check if we were redirected to login page
    console.log("Current route:", window.location.pathname);
    if (window.location.pathname.includes('login')) {
      console.log("✅ Successfully redirected to login page");
    } else {
      console.log("❌ Not redirected to login page");
    }
    
  } catch (error) {
    console.error("Error during logout test:", error);
  }
};

// Note: Run this in the browser console after logging in
// testLogout();