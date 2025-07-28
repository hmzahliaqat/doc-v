// Test script to verify the router guard fix
// This would be run in the browser console

const testRouterGuard = async () => {
  console.log("Testing router guard behavior after logout:");
  
  try {
    // Assuming we have access to the Vue app instance
    const app = document.querySelector('#app').__vue_app__;
    const router = app._instance.appContext.provides.router;
    const authStore = app._instance.appContext.provides.authStore;
    
    console.log("Current authentication state:", authStore.isAuthenticated);
    
    // Test 1: Simulate logout and navigation
    console.log("Test 1: Simulating logout and navigation");
    
    // First, log out
    console.log("Logging out...");
    await authStore.logoutUser();
    console.log("Authentication state after logout:", authStore.isAuthenticated);
    
    // Then navigate to a protected route
    console.log("Navigating to dashboard (protected route)...");
    await router.push('/dashboard');
    
    // Check if we were redirected to login
    console.log("Current route after navigation:", router.currentRoute.value.name);
    if (router.currentRoute.value.name === 'login') {
      console.log("✅ Successfully redirected to login page");
    } else {
      console.log("❌ Not redirected to login page");
    }
    
    // Test 2: Check if API calls are being made
    console.log("\nTest 2: Checking API calls");
    
    // Create a proxy for the fetch function to monitor API calls
    const originalFetch = window.fetch;
    let apiCallsMade = [];
    
    window.fetch = function(url, options) {
      if (url.includes('/api/user')) {
        apiCallsMade.push({ url, options });
        console.log("API call detected:", url);
      }
      return originalFetch.apply(this, arguments);
    };
    
    // Navigate to login page directly
    console.log("Navigating directly to login page...");
    await router.push('/login');
    
    // Wait a moment to allow any API calls to happen
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if any API calls were made
    if (apiCallsMade.length === 0) {
      console.log("✅ No API calls to /api/user when navigating to login");
    } else {
      console.log("❌ API calls to /api/user were made:", apiCallsMade.length);
    }
    
    // Restore original fetch
    window.fetch = originalFetch;
    
    console.log("\nTests completed");
    
  } catch (error) {
    console.error("Error during router guard test:", error);
  }
};

// Note: Run this in the browser console after the app is loaded
// testRouterGuard();