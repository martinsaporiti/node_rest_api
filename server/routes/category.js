const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const _ = require('underscore');

// Configuration...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Load the Category Model.
const Category = require('../model/category');

const { validateToken, validateAdminRole } = require('../middlewares/authentication');


// Get all Categories...
app.get('/category', validateToken, (req, res) => {
    
    let condition = {
        status: true
    };

    Category.find(condition)
        .populate('user', 'name')
        .sort('name')
        .exec( (err, categories) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        Category.count(condition, (err, count) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                categories,
                count
            });

        })
    })

});

// Get a Category by id...
app.get('/category/:id', validateToken, (req, res) => {

    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {

        if(err){

            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });

});


// Create a Category...
app.post('/category', [validateToken, validateAdminRole], (req, res) => {

    let body = req.body

    // Create the Category.
    let category = new Category({
        name: body.name,
        user: req.user._id
    })

    // Save the Category.
    category.save( (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                error: `Category with id ${id} does not exist`
            });
        }

        res.status(200).json({
            category: categoryDB
        })

    });

});


// Modify a Category
app.put('/category/:id', [validateToken, validateAdminRole], (req, res) =>{

    let id = req.params.id;
    let body = _.pick(req.body, ['name']); 

    Category.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true, context: 'query' }, 
        (err, categoryDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                error: `Category with id ${id} does not exist`
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });

});

// Delete a Category...
app.delete('/category/:id', [validateToken, validateAdminRole], (req, res) =>{

    let id = req.params.id;

    let newStatus = {
        status: false
    }

    Category.findByIdAndUpdate(id, newStatus, 
        { new: true, runValidators: true, context: 'query' }, 
        (err, categoryDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                error: `Category with id ${id} does not exist`
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });

});

module.exports = app;