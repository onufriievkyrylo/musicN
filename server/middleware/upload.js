const path = require('path')
const crypto = require('crypto')
const multer = require('koa-multer')

const storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = crypto.randomBytes(16)
    cb(null, `${filename.toString('hex')}${ext}`)
  }
})

module.exports = multer({ storage })
