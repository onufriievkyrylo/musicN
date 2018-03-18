const crypto = require('crypto')

class Password {
  static create(password) {
    const salt = Password.salt(64)
    const hash = Password.hash(password, salt)
    return { salt, hash }
  }
  static hash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 127, 'sha512').toString('hex')
  }
  static salt(length) {
    return crypto.randomBytes(length).toString('base64')
  }
}

module.exports = Password
