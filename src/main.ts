import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './index.css'
import piniaPersist from 'pinia-plugin-persistedstate'
import VueApexCharts from "vue3-apexcharts";


const pinia = createPinia();
pinia.use(piniaPersist);

createApp(App).use(router).use(pinia).use(VueApexCharts).mount('#app');