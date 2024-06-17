const express = require('express');
const bodyParser = require('body-parser');
const connectToDB = require('./utils/mongoose');
const startEvent = require('./utils/scheduler');
require('dotenv').config();


const app = express();

app.use(bodyParser.json());

// routes
//app.use('/profile', require('./routes/profileRoutes'));

//connect to database
connectToDB();

// start server
const port =  process.env.PORT || 3000;
const server = app.listen(port);
console.log('Express started. Listening on %s', port);

//start event
startEvent();