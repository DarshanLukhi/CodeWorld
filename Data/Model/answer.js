const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    userId : {
        type: String,
        required : true
    },
    answer:{
        type: String,
        required : true
    },
    questionId :{
        type: String,
        required : true
    },
    timeStamp :{
        type: Number,
    },
    likeCount: {
        type: Number,
    },
    dislikeCount: {
        type: Number,
    },
});

module.exports = mongoose.model('answer', AnswerSchema);