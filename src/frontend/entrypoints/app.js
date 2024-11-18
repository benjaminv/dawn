import 'vite/modulepreload-polyfill';
import Alpine from 'alpinejs';
import StoreMain from './store-main';
import './swym-custom-wishlist-button';

Alpine.store('main', StoreMain);

window.Alpine = Alpine;

Alpine.start();
