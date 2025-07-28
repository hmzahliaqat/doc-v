import type { DirectiveBinding } from 'vue';

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: {
    handler: (event: MouseEvent) => void;
    exclude: () => HTMLElement[];
  };
}

export default {
  beforeMount(el: ClickOutsideElement, binding: DirectiveBinding) {
    const handler = (event: MouseEvent) => {
      // Add safety check to ensure element is still in DOM
      if (!el || !document.body.contains(el)) {
        return;
      }
      
      const target = event.target as Node;
      // Check if the click was outside the element
      if (el !== target && !el.contains(target)) {
        binding.value(event);
      }
    };

    // Define the handler function on the element
    el._clickOutside = {
      handler,
      exclude: () => []
    };

    // Add the event listener
    document.addEventListener('click', handler);
  },
  
  unmounted(el: ClickOutsideElement) {
    // Remove the event listener when the element is unmounted
    // Add a try-catch block to handle potential DOM errors
    try {
      if (el && el._clickOutside) {
        document.removeEventListener('click', el._clickOutside.handler);
        delete el._clickOutside;
      }
    } catch (error) {
      console.error('Error in click-outside directive unmounted hook:', error);
      // Continue execution even if there's an error
    }
  }
};