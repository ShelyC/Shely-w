
let shoppingCart = [];
let finalSum = 0;
const items = [
    {
        image: "../media/chalah/chalah.jpeg",
        name: "1 Challah for Shabbat",
        price: 25,
        category: 'recomended',
        id: 1
    },
    {
        name: "Alfahors hearts-5 units",
        image: "../media/cookies/alphahores.jpeg",
        price: 30,
        category: 'recomended',
        id: 2
    },
    {
        image: "../media/misc/coco_fadg.jpeg",
        name: "1 White chocolate fudge with pistachio",
        price: 30,
        category: 'recomended',
        id: 3
    },
    {
        image: "../media/cakes/apple_pai.jpeg",
        name: "Chocolate and pistachio yeast cake",
        price: 55,
        category: 'yeast',
        id: 4
    },
    {
        image: "../media/yeast/yeast_cheese.jpeg",
        name: "Cheese yeast cake",
        price: 55,
        category: 'yeast',
        id: 5
    },
    {
        image: "../media/yeast/rogalah_cake.jpeg",
        name: "Roglach cake (chocolate, pistachio, hazelnut spread)",
        price: 45,
        category: 'yeast',
        id: 6
    },
    {
        image: "../media/cookies/alphahores.jpeg",
        name: "Alfahors hearts-5 units",
        price: 30,
        category: 'cookies',
        id: 7
    },
    {
        image: "../media/cookies/healthy_cookies.jpeg",
        name: "Oatmeal cookies and chocolate chips-5 units",
        price: 30,
        category: 'cookies',
        id: 8
    },
    {
        image: "../media/cookies/maamul.jpeg",
        name: "Ma'amul with a spread of dates and nuts-5 units",
        price: 35,
        category: 'cookies',
        id: 9
    },
    {
        image: "../media/cakes/lotus_cheese_cake.jpeg",
        name: "Baked lotus cheese cake",
        price: 250,
        category: 'cakes',
        id: 10
    },
    {
        image: "../media/cakes/cheese_cake.jpeg",
        name: "Cheesecake with crumbles",
        price: 150,
        category: 'cakes',
        id: 11
    },
    {
        image: "../media/cakes/apple_pai.jpeg",
        name: "Apple pie",
        price: 170,
        category: 'cakes',
        id: 12
    },
    {
        image: "../media/chalah/chalah.jpeg",
        name: "1 Challah for Shabbat",
        price: 25,
        category: 'bread',
        id: 13
    },
    {
        image: "../media/chalah/cosemet_bread.jpg",
        name: "Buckwheat bread and seeds",
        price: 35,
        category: 'bread',
        id: 14
    },
    {
        image: "../media/chalah/buns.jpg",
        name: "Challah rolls-5 units",
        price: 35,
        category: 'bread',
        id: 15
    },
];

const localStorageKey = 'cartItems';

//check if the item exist in the local storage
function getItems() {
    const localStorageString = localStorage.getItem(localStorageKey);
    if (localStorageString) {
        return JSON.parse(localStorageString);
    } else {
        return [];
    }
}

//change the items object to string and save it in the local storage 
function saveItems(cartItems) {
    const cartItemsString = JSON.stringify(cartItems);
    localStorage.setItem(localStorageKey, cartItemsString);
}

//add item to cart array
function addToCart(item) {
    const cartIndex = shoppingCart.findIndex(cartItem => cartItem.id == item.id);
    // if exist in cart and cahnging the amount and final price
    if (cartIndex > -1) {
        shoppingCart[cartIndex].amount++;
        shoppingCart[cartIndex].finalPrice += item.price;
    //add a new item to cart    
    } else {
        shoppingCart.push({
            image: item.image,
            name: item.name,
            price: item.price,
            category: item.category,
            id: item.id,
            amount: 1, 
            finalPrice: item.price
        });
    }
    saveItems(shoppingCart);
    renderCart();
}

// remove item from cart
function removeFromCart(item) {
    const cartItemIndex = shoppingCart.findIndex(cartItem => cartItem.id == item.id);
    //if exist remove the item each time 1 unit
    if (cartItemIndex > -1) {
        const cartItem = shoppingCart[cartItemIndex];
        if (cartItem.amount > 1) {
            cartItem.amount--;
            cartItem.finalPrice -= item.price;
        //delete the item from cart    
        } else {
            shoppingCart.splice(cartItemIndex, 1);
        }
        saveItems(shoppingCart);
        renderCart();
    }
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
        finalSum += shoppingCart[i].finalPrice;
    }
    updateFinalPrice();
}

//show price and link to purchase
function updateFinalPrice() {
    const purchaseContainer = document.getElementById('total-price');
    purchaseContainer.innerHTML = '';
    if (finalSum > 0 ) {
        const totalPrice = document.createElement('div');
        const purchaseLink = document.createElement('a');
        purchaseLink.href = './purchase.html';
        purchaseLink.innerText = 'Buy now';
        totalPrice.innerText = "Subtotal: " + finalSum + "₪";
        purchaseContainer.appendChild(totalPrice);
        purchaseContainer.appendChild(purchaseLink); 
    }
}

//show all items on home page-index
function showItems() {
    const cakesSection = document.getElementById('cakes');
    const yeastCakesSection = document.getElementById('yeast-cakes');
    const recomendedSection = document.getElementById('recomended');
    const cookiesSection = document.getElementById('cookies');
    const challahBreadsSection = document.getElementById('challah-breads');
    
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
    const amount = document.createElement('td');
    const price = document.createElement('td');
    const action = document.createElement('td');
    const removeButton = document.createElement('button');

    containerTR.classList.add('cart-item');
    title.innerText = item.name;
    price.innerText = item.finalPrice + "₪";
    amount.innerText = item.amount;
    removeButton.innerText = 'Remove';
    removeButton.onclick = () => {
        removeFromCart(item);
    }

    action.appendChild(removeButton);
    containerTR.appendChild(title);
    containerTR.appendChild(amount);
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

shoppingCart = getItems();
showItems();
renderCart();