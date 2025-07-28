// Test script to verify the click-outside directive
// This would be run in the browser console

const testClickOutsideDirective = () => {
  console.log("Testing click-outside directive implementation:");
  
  try {
    // Check if the directive is registered
    const app = document.querySelector('#app').__vue_app__;
    const hasDirective = app._context.directives && app._context.directives['click-outside'];
    
    if (hasDirective) {
      console.log("✅ click-outside directive is properly registered");
    } else {
      console.log("❌ click-outside directive is not registered");
    }
    
    // Test dropdown functionality
    const dropdown = document.querySelector('.relative.ml-3');
    if (dropdown) {
      console.log("Found dropdown element, testing functionality:");
      
      // Get the dropdown button and click it
      const dropdownButton = dropdown.querySelector('button');
      if (dropdownButton) {
        console.log("Clicking dropdown button to open menu...");
        dropdownButton.click();
        
        // Check if dropdown menu is visible
        setTimeout(() => {
          const menu = dropdown.querySelector('.absolute');
          if (menu && window.getComputedStyle(menu).display !== 'none') {
            console.log("✅ Dropdown menu opened successfully");
            
            // Now click outside to test the directive
            console.log("Clicking outside to test directive...");
            document.body.click();
            
            // Check if dropdown closed
            setTimeout(() => {
              if (!dropdown.querySelector('.absolute') || 
                  window.getComputedStyle(dropdown.querySelector('.absolute')).display === 'none') {
                console.log("✅ Dropdown closed when clicking outside - directive works!");
              } else {
                console.log("❌ Dropdown did not close - directive may not be working");
              }
            }, 100);
          } else {
            console.log("❌ Dropdown menu did not open");
          }
        }, 100);
      } else {
        console.log("❌ Could not find dropdown button");
      }
    } else {
      console.log("❌ Could not find dropdown element");
    }
    
  } catch (error) {
    console.error("Error during directive test:", error);
  }
};

// Note: Run this in the browser console after the app is loaded
// testClickOutsideDirective();