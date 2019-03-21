const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let Ranking = new Schema({
    user_name: {
        type: String,
    },
    contestCode: {
        type: String,
    },
    points: {
        type: Number,
    },
    problems:[],
    rank:{
        type: Number,
    },
    rating: {
        type: Number,
    }
})
module.exports = mongoose.model('Ranking', Ranking);