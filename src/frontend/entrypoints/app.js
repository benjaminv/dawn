import 'vite/modulepreload-polyfill';
import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';

window.Swiper = Swiper;
window.Alpine = Alpine;

Alpine.start();
