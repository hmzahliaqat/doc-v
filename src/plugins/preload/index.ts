import { preloadFont } from './font';
import { preloadImages, preloadStorage } from './local';

export default {
  install() {
    // Preload resources without updating loading screen (loading screen removed)
    const preloads = [
      { promise: preloadFont('Gen Jyuu Gothic P', 'GenJyuuGothic-P.woff2') },
      { promise: preloadStorage() },
      { promise: preloadImages() },
    ];

    // Execute all preloads in parallel without tracking progress
    Promise.all(preloads.map(preload => preload.promise));
    
    // No need to close loading screen as it has been removed
  },
};

// Loading screen related functions removed as the loading screen has been removed
