const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


var userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: 'Username can\'t be empty',
        unique: true
    },
    first_name: {
        type: String,
        required: 'Firstname can\'t be empty'
    },
    last_name: {
        type: String,
        required: 'Lastname can\'t be empty'
    },
    email_id: {
        type: String,
        required: 'EmailID can\'t be empty',
        unique: true
    },
    mobile_no: {
        type: String
    },
    gender: {
        type: String
    },
    birth_date: {
        type: Date
    },
    role: {
        type: String
    }, 
    city: {
        type: String
    },
    state: {
        type: String
    }, 
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength:[6,'Password must be atleast 6 character long']
    },

}) ;

//Custom validation for email
userSchema.path('email_id').validate((val) => {
    emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]{2,5}$/;
    return emailRegex.test(val);
}, 'Invalid emailID.' );


userSchema.methods.verifyPassword = function (password) {
    return password == this.password;
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({_id: this._id,role: this.role,user_name: this.user_name},"SECRET#123",{ expiresIn: "60m" });
}

module.exports = mongoose.model('User',userSchema);
