import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import Toaster from '@meforma/vue-toaster' // نیا toaster پیکیج
import '@fortawesome/fontawesome-free/css/all.css'; 
const app = createApp(App);
app.use(store);
app.use(Toaster, {
    // One of the options
    position: "top",
  }); // Vue 3 میں `Vue.use()` نہیں، بلکہ `app.use()` ہوتا ہے
app.mount('#app');
