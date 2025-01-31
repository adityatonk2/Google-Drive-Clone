
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

function connectToDb(){
    mongoose.connect(uri) 
        .then(() => console.log("Database connected successfully"))
        .catch(err => console.error("Database connection error:", err));
}

module.exports = connectToDb;