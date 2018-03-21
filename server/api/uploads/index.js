const Router = require('koa-router')
const NodeID3 = require('node-id3')
const sokets = require('../../sockets')
const upload = require('../../middleware/upload')
const router = new Router({
  prefix: '/uploads'
})

router.post('/', upload.single('file'), ctx => {
  const tags = NodeID3.read(ctx.req.file.path)
  ctx.body = {
    tags,
    url: ctx.req.file.path
  }
})

module.exports = router.routes()
