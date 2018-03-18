const jwt = require('jsonwebtoken')
const { secret } = require('../config')

class Token {
  constructor(data, { expiresIn = '30m' } = {}) {
    this.token = jwt.sign(data, secret, { expiresIn })
  }
  static verify(token) {
    return jwt.verify(token, secret)
  }
  toJSON() {
    return this.token
  }
}

module.exports = Token
