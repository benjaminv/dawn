import swymcsWishlistFunctions from './swym-custom-wishlist-button';

export default {
  wishlists: [],
  productsWishlised: [],

  sayHello() {
    console.log('$store.main', {
      wishlists: this.wishlists,
      productsWishlised: this.productsWishlised,
    });
  },

  init() {
    document.addEventListener('alpine:initialized', () => {
      setTimeout(() => {
        this.sayHello();
      }, 1000);
      if (!window.SwymCallbacks) {
        window.SwymCallbacks = [];
      }
      window.SwymCallbacks.push(swymcsWishlistFunctions.init);
    });
  },
};
