//environment variables
require('dotenv').config();

// Common modules
const path = require('path');

// Initializing Express
const express = require('express'),
      app = express(),
      port = process.env.PORT;


//permission to serve static files
//app.use(express.static('public'))
app.use(express.static("dist", { root: '.' }));

// View engine
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'pug')

// Routers
app.use('/', require('./index'));


// Run server
app.listen(port);
