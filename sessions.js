const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');



app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

