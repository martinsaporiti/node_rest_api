// CONFIGURATIONS...

// Server port
module.exports.PORT = process.env.PORT || 3000;

// Token Configuration (Only for Development Environment!)
module.exports.TOKEN_EXP =  process.env.TOKEN_EXP || '2h';
module.exports.TOKEN_SECRET = process.env.TOKEN_SECRET || 'a secret';

// Mongo string connection configuration...
module.exports.MONGO_DB_STR_CONNECTION = process.env.MONGO_DB_STR_CONNECTION || 'mongodb://localhost:27017/producto'