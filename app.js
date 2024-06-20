const express = require('express');
const bodyParser = require('body-parser');
const connectToDB = require('./utils/mongoose');
const startEvent = require('./utils/scheduler');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();

app.use(bodyParser.json());
app.use(cookieParser())

app.use('/auth', require('./routes/authRoutes'));
app.use('/gold-rush', require('./routes/goldRushRoutes'));

//connect to database
connectToDB();

// start server
const port =  process.env.PORT || 3000;
const server = app.listen(port);
console.log('Express started. Listening on %s', port);