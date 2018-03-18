const Router = require('koa-router')
const sokets = require('../../sockets')
const upload = require('../../middleware/upload')
const router = new Router({
  prefix: '/uploads'
})

router.post('/', upload.single('file'), ctx => {
  ctx.body = {
    url: ctx.req.file.path
  }
})

module.exports = router.routes()
