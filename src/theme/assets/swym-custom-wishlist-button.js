/* Initializes the wishlist functions by fetching the list and adding event listeners. */

const init = (swat) => {
  let lists = fetchList(swat);
  if(!window.swymSelectedListId){
     createList(swat);
  }
  addSwymEventListener(swat);
};

/* Create a new wishlist if it doesn't already exist. */

const createList = (swat) => {
    let listConfig = { "lname": "My Wishlist" };
  
    let onSuccess = function({lid}) { 
      console.log("Successfully created a new List", lid);
      window.swymSelectedListId = lid;
    }
    
    let onError = function(error) {
      console.log("Error while creating a List", error);
    }
    
    swat.createList(listConfig, onSuccess, onError);
}

/* Fetches the wishlist data. */

const fetchList = async (swat) => {
  return new Promise((resolve, reject) => {
    const onSuccess = (lists) => {
      console.log("Fetched all Lists", lists);
      window.swymWishLists = lists;
      window.swymSelectedListId = lists && lists[0] && lists[0].lid;
      resolve(lists);
      updateButtonState();
    };

    const onError = (error) => {
      console.log("Error while fetching all Lists", error);
      reject(error);
    };

    if (!window.swymWishLists) {
      swat.fetchLists({
        callbackFn: onSuccess,
        errorFn: onError
      });
    } else {
      resolve(window.swymWishLists);
    }
  });
};

/* Create a new wishlist if not already exist. */

// const createList = (swat) => {
  
//     let listConfig = { "lname": "My Wishlist" };
    
//     let onSuccess = function({lid}) { 
//       console.log("Successfully created a new List", lid);
//       window.swymSelectedListId = lid;
//     }
    
//     let onError = function(error) {
//       console.log("Error while creating a List", error);
//     }
    
//     swat.createList(listConfig, onSuccess, onError);
// }

/* Refreshes the wishlist by fetching the list again in the global scope. */

const refreshList = async (swat) => {
  window.swymWishLists = null;
  await fetchList(swat);
};

/* Adds product to wishlist action. */

const addToWishlist = (swat, product) => {
    let onSuccess = async function (addedListItem){
      console.log('Product has been added to wishlist!', addedListItem);
    }
    
    let onError = function (error){
      swat.ui.showErrorNotification({ message: "Error Adding Product to Wishlist" });
    }

    let lid = window.swymSelectedListId;

    swat.addToList(lid, product, onSuccess, onError);
}

/* Remove product from wishlist action. */

const removeFromWishlist = (swat, product) => {
  let onSuccess = async function(deletedProduct) {
    console.log('Product has been removed from wishlist!', deletedProduct);
  }
  
  let onError = function(error) {
    swat.ui.showErrorNotification({ message: "Error removing Product from Wishlist" });
  }

  let lid = window.swymSelectedListId;

  swat.deleteFromList(lid, product, onSuccess, onError);
}

/* Updates the state of wishlist buttons based on whether items are wishlisted. */

const updateButtonState = () => {
  const swymWishlistButtons = document.querySelectorAll('swymcs-wishlist-button');

  if (swymWishlistButtons) {
    swymWishlistButtons.forEach((swymWishlistButton) => {
      const elements = swymWishlistButton.elements;
      const { epi, empi } = elements.wishlistButton.dataset;
      let isWishlisted = false;

      if (window.swymWishLists) {
        window.swymWishLists.forEach(list => {
          list.listcontents.forEach(item => {
            if (item.empi == empi && item.epi == epi) {
              isWishlisted = true;
            }
          });
        });
        updateButtonWishlistState(elements, isWishlisted);
      }
    });
  }
};

/* Updates the display state of a wishlist button based on whether the item is wishlisted. */

const updateButtonWishlistState = (elements, isWishlisted) => {
  let settings = JSON.parse(elements.wishlistButton.dataset.settings);
  elements.filledState.style.display = isWishlisted ? 'flex' : 'none';
  elements.unfilledState.style.display = isWishlisted ? 'none' : 'flex';
  if (isWishlisted) {
    elements.wishlistButton.classList.add('swym-added-custom');
    if(settings.disable_added_to_wishlist){
       elements.wishlistButton.setAttribute('disabled', true);
    }
  } else {
    elements.wishlistButton.classList.remove('swym-added-custom');
    elements.wishlistButton.classList.remove('disabled');
    elements.wishlistButton.removeAttribute('disabled');
  }
};

/* Render multiple wishlist popup when multiple wishlist enabled */

const renderPopup = async(product) => {
  let popup = document.querySelector('swym-wishlist-popup');
  let { epi, empi, du } = product;
  window.currentActiveProduct = await fetchProductsData(du);
  window.currentActiveVariant =  currentActiveProduct.variants.find((variant) => variant.id == epi);
  window.currentActiveVariantId = epi;
  window.currentActiveProduct.url = du;
  setTimeout(popup._show.bind(popup), 100);
} 

/* Fetches product data from shopify to get updated data. */

const fetchProductsData = async (url) => {
  const productData = await fetch(`${url}.js`);
  if (productData.status === 404 || !productData.ok) return null;
  const jsonData = await productData.json();
  return jsonData;
};

/* Adds event listeners for wishlist actions. */

const addSwymEventListener = (swat) => {
  swat.evtLayer.addEventListener(swat.JSEvents.removedFromWishlist, (event) => {
    let image = event.detail.d.iu;
    let title = event.detail.d.dt;
    showCustomNotification(swat, image, title, 'remove', 1);
    refreshList(swat); 
  });
  
  swat.evtLayer.addEventListener(swat.JSEvents.addedToWishlist, (event) => {
    let image = event.detail.d.iu;
    let title = event.detail.d.dt;
    showCustomNotification(swat, image, title, 'add', 1);
    refreshList(swat);
  });

  swat.evtLayer.addEventListener(swat.JSEvents.variantChanged, (data) => {
    const currentVariant = data.detail.d.variant.id;
    const currentProductId = data.detail.d.product.id;
    const swymCustomWishlistButton = document.querySelector(`.swymcs-wishlist-button-${currentProductId}`);
    if (swymCustomWishlistButton) {
      swymCustomWishlistButton.setAttribute('data-epi', currentVariant);
    }
    setTimeout(updateButtonState, 200);
  });
};

const showCustomNotification = ( swat, image, title, action, listCount ) => {
      let successMessage = `
      <style>
          .swym-notification-success-inner .swym-image{ display: none !important }
          #swym-custom-notification-content { display: flex; gap: 10px; align-items: center; cursor: pointer }
          #swym-custom-notification-content #swym-custom-image-container { min-height: 50px; min-width: 50px; max-height: 50px; max-width: 50px }
          #swym-custom-notification-content #swym-custom-image-container #swym-custom-image { width: 100%; height: 100%; object-fit: cover; border-radius: 50% }
          #swym-custom-notification-content #swym-custom-title-container { font-weight: 500; font-size: 14px }
      </style>
      <div id="swym-custom-notification-content" onclick="_swat.ui.open()">
          <div id="swym-custom-image-container">
              <img id="swym-custom-image" src="${image}" alt="wishlisted product image"/>
          </div>
          <div id="swym-custom-title-conatainer"><strong>${title}</strong> has been ${action=='remove'?'removed from':'added to'} <strong> ${listCount == 1 ? 'list!' : 'lists!'}</strong></div>
      </div>
    `;
    swat.ui.showSuccessNotification({ message: successMessage });
}


/* Creating a global object to assign functions */

const swymcsWishlistFunctions = {
  init,
  fetchList,
  refreshList,
  updateButtonState,
  updateButtonWishlistState,
  addToWishlist,
  removeFromWishlist,
  addSwymEventListener,
  fetchProductsData,
  renderPopup,
  showCustomNotification
};

/* Push the init functions into SwymCallbacks  */

if (!window.SwymCallbacks) {
  window.SwymCallbacks = [];
}
window.SwymCallbacks.push(swymcsWishlistFunctions.init);

/* Expose swymcsWishlistFunctions to the global scope */

window.swymcsWishlistFunctions = swymcsWishlistFunctions;