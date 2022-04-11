//environment variables
require('dotenv').config();

// Common modules
const path = require('path');

// Initializing Express
const express = require('express'),
      app = express(),
      port = process.env.PORT;


//permission to serve static files
app.use(express.static("dist", { root: '.' }));

// Routers
app.use('/', require('./index'));




// Run server
app.listen(port, console.log(port));
