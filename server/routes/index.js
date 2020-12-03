const express = require('express')
const app = express()


// Routes...

// Login
app.use(require('./login'));

// User
app.use(require('./user'));

// Category
app.use(require('./category'));

// Product
app.use(require('./product'));


module.exports = app;