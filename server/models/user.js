const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('User', schema)
