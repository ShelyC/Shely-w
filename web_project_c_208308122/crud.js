const sql = require('./db/db');

const getItems = (cb) => {
    const itemsQuery = "select * from items ";
    sql.query(itemsQuery, (err, items) => {
        if (items) {
            cb(items);
        } else {
            cb([]);
        }

    });
}

const getCart = (cb) => {
    const itemsQuery = "select * from cart";
    sql.query(itemsQuery, (err, results) => {
        cb(results || []);
    });
}

const addToCart = (item, cb) => {
    const itemsQuery = "select * from items where id=?";
    sql.query(itemsQuery, item.id, (err, results) => {
        const checkIfExists = "select * from cart where itemId=?";
        const dbItem = results[0];
        sql.query(checkIfExists, dbItem.id, (err, items) => {
            if (items.length) {
                const updated = { ...items[0], quantity: items[0].quantity + 1, price: items[0].price + item.price }
                update(updated, cb);
            } else {
                add(dbItem, cb);
            };
        });
    });
}

const update = (item, cb) => {
    const updateCartQuery = "update cart set quantity=?, price = ? WHERE itemId= ? "
    sql.query(updateCartQuery, [item.quantity, item.price, item.itemId], (err, mysqlres) => {
        getCart(cb);
    });
}

const add = (item, cb) => {
    const cartItem = {
        price: item.price,
        name: item.name,
        category: item.category,
        itemId: item.id,
        image: item.image,
        quantity: 1,
    };

    const addItemQuery = "insert cart set ?";
    sql.query(addItemQuery, cartItem, (err, mysqlres) => {
        getCart(cb);
    });
}


const removeFromCart = (item, cb) => {
    if (item.quantity == 1) {
        const removeQuery = "DELETE from cart where itemId=?";
        sql.query(removeQuery, item.itemId, (err, mysqlres) => {
            getCart(cb);
        });
    } else {
        const itemsQuery = "select * from items where id=?";
        sql.query(itemsQuery, item.id, (err, results) => {
            if (results.length) {
                const updatedItem = {
                    ...item,
                    quantity: item.quantity - 1,
                    price: item.price - results[0].price
                };
                update(updatedItem, cb);
            } else {
                getCart(cb);
            }
        });
    }

}

const insertOrder = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "content cannot be empty"
        });
        return;
    }

    // bring all items from cart
    const getCartItems = "SELECT * from cart ";
    sql.query(getCartItems, (err, items) => {
        if (err) {
            res.render('purchase');
            return;
        }

        const priceSum = items.reduce((sum, item) => {
            sum += item.price;
            return sum;
        }, 0);

        const newOrderEntry = {
            "mail": req.body.email,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "address": req.body.address,
            "orderDT": new Date(),
            "tA": req.body.takeAway,
            "comments": req.body.comment,
            "totalPrice": priceSum
        }

        // add order to db
        const insertItemQuery = "INSERT INTO orders SET ? ";
        sql.query(insertItemQuery, newOrderEntry, (err, order) => {
            if (err) {
                res.status(400).send({ message: "error on creating order " + err });
                console.log("error on creating order " + err);
                return;
            }

            console.log("created new order succesfully " + order);

            const details = items.map(item => ([
                item.itemId,
                order.insertId,
                item.quantity,
                item.price
            ]));

            //////////////////////////////////////////////////////////////////////////////////////////////////
            const insertDetailsQuery = "INSERT INTO `details` (itemId , orderID , quantity , price ) VALUES ?";
            sql.query(insertDetailsQuery, [details], (err, mysqlres) => {
                if (err) {
                    console.log("error on getting details " + err);
                    res.status(400).send({ message: "error on getting details " + err });
                    return;
                }
                console.log("order details saved " + mysqlres);
                sql.query('TRUNCATE TABLE cart', (err, result) => showDetails(newOrderEntry, items ,res));

            });
        });


    });
}


const showDetails = (orderEntry, cartItems, res) => {
   res.render('purchase-details', {
    orderEntry: {
        ...orderEntry,
        orderDT: new Date(orderEntry.orderDT).toLocaleString(),
        tA: orderEntry.tA == 0 ? 'No' : 'Yes'
    }, 
    cartItems, 
    shoppingCart: []});
}



module.exports = { getItems, addToCart, add, update, insertOrder, getCart, removeFromCart };


