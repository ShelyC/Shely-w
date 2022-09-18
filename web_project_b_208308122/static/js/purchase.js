const localStorageKey = 'cartItems';
let shoppingCart = [];
let finalSum = 0;

//check if the item exist in the local storage
function getItems() {
    const localStorageString = localStorage.getItem(localStorageKey);
    if (localStorageString) {
        return JSON.parse(localStorageString);
    } else {
        return [];
    }
}

//render-show all items in cart
function renderCart() {
    const cart = document.getElementById('shopping-cart');
    for (let i = 0; i < shoppingCart.length; i++) {
        createCartItem(cart, shoppingCart[i], i);
        finalSum += shoppingCart[i].finalPrice;
    }
    updateFinalPrice();
}


//show price 
function updateFinalPrice() {
    const purchaseContainer = document.getElementById('total-price');
    purchaseContainer.innerHTML = '';
    if (finalSum > 0 ) {
        const totalPrice = document.createElement('div');
        totalPrice.innerText = "Subtotal: " + finalSum + "₪";
        purchaseContainer.appendChild(totalPrice);
    }
}

//add rows in cart table Of the choosen Items
function createCartItem(container, item) {
    const containerTR = document.createElement('tr');
    const title = document.createElement('td');
    const amount = document.createElement('td');
    const price = document.createElement('td');
    const removeButton = document.createElement('button');

    containerTR.classList.add('cart-item');
    title.innerText = item.name;
    price.innerText = item.finalPrice + "₪";
    amount.innerText = item.amount;
    removeButton.innerText = 'Remove';


    containerTR.appendChild(title);
    containerTR.appendChild(amount);
    containerTR.appendChild(price);
    container.appendChild(containerTR);
}



function showPositionTracker(shouldShow) {
    const btn = document.getElementById('location-btn'); 
    if (shouldShow) {
        btn.hidden = false;
    } else {
        btn.hidden = true;
    }
}

function getLocation() {
    if(navigator.geolocation) {
        showLoader(true);
        navigator.geolocation.getCurrentPosition(findAddress, showLocationError);
    } else {
        showLocationError();
    }
}

//change the css- show/hide loader
function showLoader(shouldShow) {
    const loader = document.getElementById('loader');
    if (shouldShow) {
        loader.style.display = 'flex';
    } else {
        loader.style.display = 'none';
    }
}

function showLocationError() {
    alert("There is no option to find your location.");
    showLoader(false);
}

function findAddress(position) {
    geo_loc = processGeolocationResult(position);
    currLatLong = geo_loc.split(",");
    initializeCurrent(currLatLong[0], currLatLong[1]);
}

//Get geo location result
function processGeolocationResult(position) {
    html5Lat = position.coords.latitude; //Get latitude
    html5Lon = position.coords.longitude; //Get longitude
    html5TimeStamp = position.timestamp; //Get timestamp
    html5Accuracy = position.coords.accuracy; //Get accuracy in meters
    return (html5Lat).toFixed(8) + ", " + (html5Lon).toFixed(8);
}

//Check value is present or
function initializeCurrent(latcurr, longcurr) {
    currgeocoder = new google.maps.Geocoder();
    if (latcurr != '' && longcurr != '') {
        const myLatlng = new google.maps.LatLng(latcurr, longcurr);
        return getCurrentAddress(myLatlng);
    }
}

//Get current address
function getCurrentAddress(location) {
    currgeocoder.geocode({'location': location}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            const address = document.getElementById('address');
            address.value = results[0].formatted_address;
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
        showLoader(false);
    });
}

shoppingCart = getItems();
renderCart();