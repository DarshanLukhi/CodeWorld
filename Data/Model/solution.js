const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let Solution = new Schema({
  user_name: {
    type: String,
  },
  DateTime: {
    type: Date,
  },
  contestCode: {
    type: String,
  },
  problemCode: {
    type: String,
  },
  status: {
    type: String,
  },
  language: {
    type: String,
  },
  location: {
    type: String,
  }
})

module.exports = mongoose.model('Solution', Solution);