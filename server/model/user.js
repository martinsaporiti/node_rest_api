const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

// Valids roles for the user.
let user_roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

// User Schema.
let userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'field name is required']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'field email is required']
    },

    password: {
        type: String,
        required: [true, 'field password is required']
    },

    img: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: 'USER_ROLE',
        enum: user_roles
    },

    status: {
        type: Boolean,
        default: true
    },
    
    google: {
        type: Boolean,
        default: false
    }
})


// Delete the password from User when call toJSON method.
userSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


let initialize = () => {

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
    
}

userSchema.plugin(uniqueValidator, { message: 'Duplicated {PATH}, must be unique!...'});
module.exports = mongoose.model('User', userSchema);