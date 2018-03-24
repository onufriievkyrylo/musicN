const Router = require('koa-router')
const sokets = require('../../sockets')
const upload = require('../../middleware/upload')
const MetaData = require('../../services/MetaData')

const router = new Router({
  prefix: '/uploads'
})

router.post('/', upload.single('file'), ctx => {
  const meta = MetaData.audio(ctx.req.file)
  ctx.body = meta
})

module.exports = router.routes()
