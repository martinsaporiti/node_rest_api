const bcrypt = require('bcrypt');
const User = require('../model/user');



// Creates default admin user.

// {
//     name: 'admin',
//     email: 'admin@admin.com',
//     password: '123456',
//     role: 'ADMIN_ROLE'
// }
const initialize = () => {

    User.count( {}   , (err, count) => {

        if(err){
           console.error("Error retriving users", err);
           return
        }

        if(count == 0){
            // Create the default User.
            let user = new User({
                name: 'admin',
                email: 'admin@admin.com',
                password: bcrypt.hashSync('123456', 10),
                role: 'ADMIN_ROLE'
            })

            // Save the User.
            user.save( (err, userDB) => {
                if (err) {
                    console.err("Error saving default user", err);
                }

            });
        }
    });
}

module.exports = initialize;


