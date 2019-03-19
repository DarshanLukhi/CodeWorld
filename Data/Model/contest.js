const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let Contest = new Schema({
  contestCode: {
    type: String,
  },
  contestName: {
    type: String,
  },
  contestStatus: {
    type: String,
  },
  problems:[],
  startDateTime: {
    type: Date,
  },
  endDateTime: {
    type: Date,
  },

  

})


module.exports = mongoose.model('Contest', Contest);