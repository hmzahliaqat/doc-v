import type { App } from 'vue';
import clickOutside from './click-outside';

export default {
  install(app: App) {
    // Register the click-outside directive
    app.directive('click-outside', clickOutside);
  }
};