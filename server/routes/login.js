const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const TOKEN_EXP = require('../config/config').TOKEN_EXP;
const TOKEN_SECRET = require('../config/config').TOKEN_SECRET;

// Configuration...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Load the Model...
const User = require('../model/user');


/* 
Login expect:
{
     'username' : 'a valid email',
     'password' : 'a valid password'
}
*/
app.post('/login', (req, res) => {

    let body = req.body;

    // 1. First, find the User...
    User.findOne( { email: body.username }, (err, user) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!user){

            return res.status(400).json({
                ok: false,
                message: 'User or password incorrect.'
            });

        }

        if( !bcrypt.compareSync(body.password, user.password) ){

            return res.status(400).json({
                ok: false,
                message: 'User or password incorrect.'
            });
        }

        let token = jwt.sign({ 
            user, 
        }, TOKEN_SECRET, { expiresIn: TOKEN_EXP });

        res.json( {
            ok: true,
            user,
            token
        })

    });

});


module.exports = app;