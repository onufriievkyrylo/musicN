const Router = require('koa-router')
const util = require('util')
const sokets = require('../../sockets')

const router = new Router({
  prefix: '/statistic'
})

router.get('/sockets', ctx => {
  ctx.body = util.inspect(sokets.instance)
})

module.exports = router.routes()