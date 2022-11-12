let finalSum = 0;

function getURL(sub) {
    return window.location.origin + sub;
}

const callApi = (url, method, data) => {
    return fetch(getURL(url), {
        method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json());
};


//add item to cart array
function addToCart(item) {
    callApi('/addToCart', 'POST', item).then((items) => {
        shoppingCart = items;
        renderCart();
    });
}

// remove item from cart
function removeFromCart(item) {
    callApi('/removeFromCart', 'DELETE', item).then((items) => {
        shoppingCart = items;
        renderCart();
    });
}

//delete all items from cart
function removeAllCartItems() {
    const cartItems = document.getElementsByClassName('cart-item');
    while (cartItems.length > 0) {
        cartItems[0].remove();
    }
    finalSum = 0;
}

//render-show all items in cart
function renderCart() {
    removeAllCartItems();
    const cart = document.getElementById('shopping-cart');
    for (let i = 0; i < shoppingCart.length; i++) {
        createCartItem(cart, shoppingCart[i], i);
        finalSum += shoppingCart[i].price;
    }
    updateFinalPrice();
}

//show price and link to purchase
function updateFinalPrice() {
    const purchaseContainer = document.getElementById('total-price');
    purchaseContainer.innerHTML = '';
    if (finalSum > 0 ) {
        const totalPrice = document.createElement('div');
        totalPrice.innerText = "Subtotal: " + finalSum + "₪";
        purchaseContainer.appendChild(totalPrice);
        
        if (showBuyNow) {
            const purchaseLink = document.createElement('a');
            purchaseLink.href = './purchase';
            purchaseLink.innerText = 'Buy now';
            purchaseContainer.appendChild(purchaseLink); 
        }
    }
}

//show all items on home page-index
function showItems() {
    const cakesSection = document.getElementById('cakes');
    const yeastCakesSection = document.getElementById('yeast-cakes');
    const recomendedSection = document.getElementById('recomended');
    const cookiesSection = document.getElementById('cookies');
    const challahBreadsSection = document.getElementById('challah-breads');

    if (!cakesSection) {
        return;
    }
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.category === 'yeast') {
            createCard(yeastCakesSection, items[i]);
        } else if (item.category === 'cookies') {
            createCard(cookiesSection, items[i]);
        } else if (item.category === 'cakes') {
            createCard(cakesSection, items[i])
        } else if (item.category === 'bread') {
            createCard(challahBreadsSection, items[i])
        } else {
            createCard(recomendedSection, items[i]);
        }
    }

}

//add rows in cart table Of the choosen Items
function createCartItem(container, item) {
    const containerTR = document.createElement('tr');
    const title = document.createElement('td');
    const quantity = document.createElement('td');
    const price = document.createElement('td');
    const action = document.createElement('td');
    const removeButton = document.createElement('button');

    containerTR.classList.add('cart-item');
    title.innerText = item.name;
    price.innerText = item.price + "₪";
    quantity.innerText = item.quantity;
    removeButton.innerText = 'Remove';
    removeButton.onclick = () => {
        removeFromCart(item);
    }

    action.appendChild(removeButton);
    containerTR.appendChild(title);
    containerTR.appendChild(quantity);
    containerTR.appendChild(price);
    containerTR.appendChild(action);
    container.appendChild(containerTR);
}

//creat item card to home page-index
function createCard(container, item) {
    const containerDiv = document.createElement('div');
    const image = document.createElement('img');
    const title = document.createElement('h2');
    const price = document.createElement('h3');
    const addToCartButton = document.createElement('button');

    containerDiv.classList.add('card');
    image.classList.add('card-image');
    title.classList.add('card-title');
    price.classList.add('card-price');
    image.src = item.image;
    title.innerText = item.name;
    price.innerText = "Price: " + item.price + "₪";
    addToCartButton.innerText = 'Add To Cart';
    addToCartButton.onclick = () => {
        addToCart(item);
    };

    containerDiv.appendChild(image);
    containerDiv.appendChild(title);
    containerDiv.appendChild(price);
    containerDiv.appendChild(addToCartButton);
    container.appendChild(containerDiv);
}

showItems();
renderCart();