const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const _ = require('underscore');

// Load the User Model.
const User = require('../model/user');
const { validateToken, validateAdminRole } = require('../middlewares/authentication')

// Configuration...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// ---- API.-----

// Method for list Users.
app.get('/user', validateToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let condition = {
        status: true
    };

    User.find( condition, 'name email img role' )
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        User.count( condition , (err, count) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                users,
                count
            });

        })
    })

})

// Method for create Users.
app.post('/user', [validateToken, validateAdminRole], (req, res) => {

    let body = req.body

    // Create the User.
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    // Save the User.
    user.save( (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.status(200).json({
            user: userDB
        })

    });

})

// Method for update User.
app.put('/user/:id', [validateToken, validateAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']); 

    User.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true, context: 'query' }, 
        (err, userDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })

    });

})


// Method for delete an User (set status = false).
app.delete('/user/:id',  validateToken, (req, res) => {

    let id = req.params.id;

    let newStatus = {
        status: false
    }

    User.findByIdAndUpdate(id, newStatus, 
        { new: true, runValidators: true, context: 'query' }, 
        (err, userDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })

    });

})


module.exports = app;