const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
    userId : {
        type: String,
        required : true
    },
    questionId:{
        type: String,
        required : true
    },
    answerId:{
        type: String,
        required : true
    },
    like :{
        type: Number,
    },
    dislike : {
        type: Number
    }
});

module.exports = mongoose.model('likes', LikesSchema);