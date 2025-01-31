const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        minlength : [3,"Minimum Lenght Must be 3 characters long"]
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        minlength : [13,"Email Must be 3 characters long"]
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : [5,"Password must be at least 5 characters long"]
    }
})

const user = mongoose.model("user", userSchema );

module.exports = user;

