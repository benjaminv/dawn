/*
 * example of extra script for theme
 * usage:
 * {%- liquid render 'vite-tag' with 'product-sticky-atc.js' -%} on specific template, 
 * or globally in theme.liquid, 
 * or imported by app.js
 */

// class StickyVariantSelect extends HTMLElement {
//   constructor() {
//     super();
//     this.variantSelect = this.querySelector('select');
//     this.mainForm = document.querySelector('form[action="/cart/add"]');
//     this.mainVariantSelect = this.mainForm.querySelector('select[name="id"]');
//     this.mainVariantSelectUI = this.mainForm.querySelector(
//       'options-selection select',
//     );
//     this.setupEventListeners();
//   }

//   setupEventListeners() {
//     this.variantSelect.addEventListener(
//       'change',
//       this.onStickyVariantChange.bind(this),
//     );
//     // Add listener for changes in the main form
//     if (this.mainVariantSelect) {
//       this.mainVariantSelect.addEventListener(
//         'change',
//         this.onMainVariantChange.bind(this),
//       );

//       // Debounce the function call for mainVariantSelectUI change
//       this.mainVariantSelectUI.addEventListener(
//         'change',
//         this.debounce(this.onMainVariantChange.bind(this), 100),
//       );
//     }
//   }

//   debounce(func, delay) {
//     let timeoutId;
//     return function () {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(func, delay);
//     };
//   }

//   onStickyVariantChange() {
//     const selectedVariantId = this.variantSelect.value;

//     // Update the main form's variant selection
//     if (this.mainVariantSelect) {
//       this.mainVariantSelect.value = selectedVariantId;
//       this.mainVariantSelect.dispatchEvent(
//         new Event('change', { bubbles: true }),
//       );
//     } else {
//       // If there's no select element, look for a hidden input
//       let variantInput = this.mainForm.querySelector('input[name="id"]');
//       if (!variantInput) {
//         // If the input doesn't exist, create it
//         variantInput = document.createElement('input');
//         variantInput.type = 'hidden';
//         variantInput.name = 'id';
//         this.mainForm.appendChild(variantInput);
//       }
//       variantInput.value = selectedVariantId;
//     }

//     // TODO: main form has additional logic handling hidden option select and UI updates, sync that here

//     // Dispatch a custom event in case other parts of the page need to react to this change
//     this.dispatchEvent(
//       new CustomEvent('stickyVariantChange', {
//         detail: { variantId: selectedVariantId },
//         bubbles: true,
//       }),
//     );
//   }

//   // New method to sync sticky select when main form changes
//   onMainVariantChange() {
//     if (this.mainVariantSelect) {
//       this.variantSelect.value = this.mainVariantSelect.value;
//     }
//   }
// }

// customElements.define('sticky-variant-select', StickyVariantSelect);

// class QuantityInputSticky extends HTMLElement {
//   constructor() {
//     super();
//     this.input = this.querySelector('input');
//     this.changeEvent = new Event('change', { bubbles: true });
//     this.mainQuantitySelector = document.querySelector('quantity-selector');
//     this.mainQuantityInput = this.mainQuantitySelector.querySelector(
//       'input[name="quantity"]',
//     );
//     this.mainMinusButtonWrapper = document.querySelector(
//       '.quantity-selector__button-wrapper--minus',
//     );
//     this.stickyMinusButtonWrapper = document.querySelector(
//       '.quantity-selector-sticky__button-wrapper--minus',
//     );

//     this.querySelectorAll('button').forEach((button) =>
//       button.addEventListener('click', this.onButtonClick.bind(this)),
//     );

//     this.input.addEventListener('change', this.onStickyInputChange.bind(this));
//     this.setupMainQuantityListeners();
//   }

//   onButtonClick(event) {
//     event.preventDefault();
//     const previousValue = this.input.value;
//     const isPlusButton =
//       event.target.name === 'plus' ||
//       event.target.closest('button[name="plus"]');

//     isPlusButton ? this.input.stepUp() : this.input.stepDown();

//     if (previousValue !== this.input.value) {
//       this.input.dispatchEvent(this.changeEvent);
//     }
//   }

//   onStickyInputChange() {
//     this.syncMainQuantity();
//   }

//   syncMainQuantity() {
//     if (this.mainQuantityInput) {
//       this.mainQuantityInput.value = this.input.value;
//       this.updateMinusButtonState();
//       // Dispatch a change event on the main quantity input
//       this.mainQuantityInput.dispatchEvent(
//         new Event('change', { bubbles: true }),
//       );
//     }
//   }

//   syncStickyQuantity() {
//     this.input.value = this.mainQuantityInput.value;
//     this.updateMinusButtonState();
//   }

//   updateMinusButtonState() {
//     const isDisabled = this.input.value == 1;
//     [this.mainMinusButtonWrapper, this.stickyMinusButtonWrapper].forEach(
//       (wrapper) => {
//         if (wrapper) {
//           wrapper.classList.toggle(
//             'quantity-selector__button-wrapper--disabled',
//             isDisabled,
//           );
//         }
//       },
//     );
//   }

//   setupMainQuantityListeners() {
//     // Listen for changes on the main quantity input
//     this.mainQuantityInput.addEventListener('change', () => {
//       this.syncStickyQuantity();
//     });

//     // Listen for click events on the main quantity selector buttons
//     this.mainQuantitySelector.querySelectorAll('button').forEach((button) => {
//       button.addEventListener('click', () => {
//         // Use a short timeout to ensure the main quantity has been updated
//         setTimeout(() => this.syncStickyQuantity(), 0);
//       });
//     });

//     // Use MutationObserver as a fallback for any other changes
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (
//           mutation.type === 'attributes' &&
//           mutation.attributeName === 'value'
//         ) {
//           this.syncStickyQuantity();
//         }
//       });
//     });

//     observer.observe(this.mainQuantityInput, { attributes: true });
//   }
// }

// customElements.define('quantity-selector-sticky', QuantityInputSticky);

// // Sticky functionality
// const BuyButtonForm = document.querySelector('form[action="/cart/add"]');
// const productStickyWrapper = document.querySelector('.product__sticky');

// function handleScroll() {
//   const BuyButtonOffset =
//     BuyButtonForm.getBoundingClientRect().top + window.scrollY;
//   const isSticky = window.scrollY > BuyButtonOffset;

//   productStickyWrapper.classList.toggle('sticky', isSticky);
//   document.body.classList.toggle('sticky__cart', isSticky);
// }

// window.addEventListener('scroll', handleScroll);
