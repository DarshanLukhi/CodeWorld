const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let Problem = new Schema({
  problemCode: {
    type: String,
  },
  problemName: {
    type: String,
  },
  problemType: {
    type: String,
  },
  problemStatus: {
    type: Boolean,
  },
  No_of_testcase:{
    type: Number,
    }, 
  

})


module.exports = mongoose.model('Problem', Problem);