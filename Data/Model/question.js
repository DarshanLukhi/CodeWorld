const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    userId : {
        type: String,
        required : true
    },
    question:{
        type: String,
        required : true
    },
    timeStamp :{
        type: Number,
    },
    ansCount : {
        type: Number
    },
    viewCount : {
        type: Number
    }
});

module.exports = mongoose.model('question', QuestionSchema);