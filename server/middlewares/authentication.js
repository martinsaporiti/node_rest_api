var jwt = require('jsonwebtoken');

const TOKEN_SECRET = require('../config/config').TOKEN_SECRET;


// Get the token the Header
let getTokenFromHeader = ( req ) => {

    // Get the token from Header
    let auth = req.get('Authorization');

    console.log(auth);
    if(auth === undefined) {
        return ""
    }
    
    let token = auth.split(" ")[1];
    return token;
}

// Validate Token ...
let validateToken = (req, res, next) => {

    let token = getTokenFromHeader(req);
    if( token === "") {

        return res.status(401).json({
            ok: false,
            err: 'Invalid Token...'
        });

    }

    jwt.verify(token, TOKEN_SECRET, ( err, decoded ) =>{

        if(err){

            return res.status(401).json({
                ok: false,
                err: 'Invalid Token...'
            });

        }

        // Get the user and load it in the request.
        req.user = decoded.user;
        next();

    });
    
}

// Validate if the user is Admin.
let validateAdminRole = (req, res, next) => {

    let token = getTokenFromHeader(req);
    if( token === "") {

        return res.status(401).json({
            ok: false,
            err: 'Invalid Token...'
        });

    }

    // Verify the token
    jwt.verify(token, TOKEN_SECRET, ( err, decoded ) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Invalid Token!'
            });
        }

        // Verify if the user is Admin
        if( decoded.user.role !== 'ADMIN_ROLE' ){
            return res.status(401).json({
                ok: false,
                err: 'You are not Admin'
            });
        }

        // Get the user and load it in the request.
        req.user = decoded.user;
        next();

    });
 
}

module.exports = {
    validateToken,
    validateAdminRole
}
