import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

createApp(App).config.productionTip = false;
createApp(App).mount('#app');
