

const express = require('express')
const mongoose = require('mongoose');
const initialize = require('./config/initialize');
const app = express()

const MONGO_DB_STR_CONNECTION = require('./config/config').MONGO_DB_STR_CONNECTION;
const PORT = require('./config/config').PORT;

// Global Routes Configuration...
app.use(require('./routes/index'));


// console.log('Mongo string connection: ', MONGO_DB_STR_CONNECTION);
// // Stablish Connection widh mongo db.
// mongoose.connect(MONGO_DB_STR_CONNECTION, 
//         {useNewUrlParser: true, useUnifiedTopology: true}, 
//         (err) => {
//             if (err) throw new Error();
    
//             console.log("Mongo connection succesfully!");
//         });

// mongoose.set('useFindAndModify', false);

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
}


const connectWithRetry = () => {
    console.log('MongoDB connection with retry', MONGO_DB_STR_CONNECTION)
    
    mongoose.connect(MONGO_DB_STR_CONNECTION, options).then(() => {
        console.log('MongoDB is connected')
        // Initialize default user.
        initialize();
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
        console.log(err);
        setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry();


// Startup the Rest Api Server...where the magic begins :)
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
