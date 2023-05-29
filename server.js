const express = require('express');
const keys = require('./config/keys.js');
const app = express();

// Setting up Database
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

// Setup Database models
require('./model/Account');

// stack more models and routes

// Setup the routes
require('./routes/authenticationRoute')(app);


app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});