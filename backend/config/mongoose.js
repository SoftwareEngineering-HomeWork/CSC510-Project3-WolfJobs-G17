const mongoose = require('mongoose');
require("dotenv").config();

//mongoose.connect('mongodb://localhost/wolfjobs_development');
mongoose.connect(process.env.DB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongodb'));

db.once('open',function(){
    console.log('Connected to database :: MongoDB')
})


module.exports = db;