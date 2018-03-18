const { Schema, model } = require('mongoose')
const Password = require('../utils/Password')

const userSchema = new Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
})

userSchema.virtual('password')
  .set(password => {
    const { hash, salt } = Password.create(password)
    this.hash = hash
    this.salt = salt
  })

const User = model('User', userSchema)

module.exports = User
