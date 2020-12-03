const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const _ = require('underscore');

// Load the User Model.
const Product = require('../model/product');
const { validateToken, validateAdminRole } = require('../middlewares/authentication')

// Configuration...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Products API

// Get all Products
app.get('/product', validateToken, (req, res) => {
    
    let condition = {
        available: true
    };

    Product.find(condition)
        .populate('user', 'name')
        .populate('category', 'name')
        .sort('name')
        .exec( (err, products) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        Product.count(condition, (err, count) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                products,
                count
            });

        })
    })

});

// Get a Product by id.
app.get('/product/:id', validateToken, (req, res) => {

    let id = req.params.id;
    Product.findById(id, (err, productDB) => {

        if(err){

            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            product: productDB
        })

    });

});


// Search Products
app.get('/product/search/:term', (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({'name': regex})
    .populate('category', 'name')
    .exec( (err, products) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }


        res.json({
            ok: true,
            products,
        });

    });

});

// Create a Product
app.post('/product', [validateToken, validateAdminRole], (req, res) => {

    let body = req.body

    // Create a Product.
    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        user: req.user._id
    })


    // Save the Product.
    product.save( (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        res.status(201).json({
            product: productDB
        })

    });

});

// Update a Product
app.put('/product/:id', [validateToken, validateAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description', 'category', 'price', 'available']); 

    Product.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true, context: 'query' }, 
        (err, productDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!productDB){
            return res.status(400).json({
                ok: false,
                error: `Product with id ${id} does not exist`
            });
        }

        res.json({
            ok: true,
            product: productDB
        })

    });
});


// Delete a Product...
app.delete('/product/:id', [validateToken, validateAdminRole], (req, res) =>{

    let id = req.params.id;

    let newStatus = {
        available: false
    }

    Product.findByIdAndUpdate(id, newStatus, 
        { new: true, runValidators: true, context: 'query' }, 
        (err, productDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!productDB){
            return res.status(400).json({
                ok: false,
                error: `Product with id ${id} does not exist`
            });
        }

        res.json({
            ok: true,
            product: productDB
        })

    });

});


module.exports = app;