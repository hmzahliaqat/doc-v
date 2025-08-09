import { createApp } from 'vue';
import App from '@/App.vue';
import errorHandlerPlugin from '@/plugins/error-handler';

import i18NPlugin from '@/plugins/i18n';
import preloadPlugin from '@/plugins/preload';
import router from '@/router';
import ToastService from 'primevue/toastservice';
import { createPinia } from './stores';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import { VueRecaptchaPlugin } from 'vue-recaptcha';

import 'virtual:svg-icons-register';
import '@/styles/index.css';
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18NPlugin);
app.use(preloadPlugin);
app.use(ToastService);
app.use(errorHandlerPlugin);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(VueRecaptchaPlugin, {
    v2SiteKey: "6LfEjZ8rAAAAAENDoqHf53o-JBp-nHiaFvaCSib2"
});
app.mount('#app');
