// import + declare what ever you need
const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const sql = require('./db/db');
const CRUD = require('./crud.js');

// setups
const app = express();
app.use(express.json())
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'pug');
app.use(express.static('static'));


// MAIN PAGES
// home route
app.get('/', (req, res) => {
    CRUD.getItems((items) => {
        CRUD.getCart((cart) => {
            res.render('index.pug', { items: JSON.stringify(items), cart: JSON.stringify(cart), showBuyNow: true });
        });
    });
});


app.get('/about', (req, res) => {
    res.render('about.pug');
});


app.get('/purchase', (req, res) => {
    CRUD.getCart((cart) => {
        res.render('purchase.pug', { cart: JSON.stringify(cart), items: JSON.stringify([]), showBuyNow: false });
    });
});

// listen
app.listen(port, () => {
    console.log("server is running on port " + port);
});

// actions 
app.post('/addToCart', (req, res) => {
    if (req.body) {
        CRUD.addToCart(req.body, (result) => {
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

app.delete('/removeFromCart', (req, res) => {
    if (req.body) {
        CRUD.removeFromCart(req.body, (result) => {
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

app.post('/purchase-details', CRUD.insertOrder);