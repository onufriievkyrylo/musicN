const Router = require('koa-router')
const Chanels = require('../../services/Chanels')
const Token = require('../../utils/Token')

const router = new Router({
  prefix: '/chanels'
})

router.get('/', ctx => {
  const { sid } = ctx.headers
  ctx.body = Chanels.get(sid)
})

router.post('/', ctx => {
  const { sid } = ctx.headers
  const chanelToken = Chanels.create(sid)
  ctx.body = { chanelToken }
})

router.param('token', (token, ctx, next) => {
  const { cid } = Token.verify(token)
  ctx.state.cid = cid
  next()
})

router.put('/:token/playlist', ctx => {
  const { sid } = ctx.headers
  const { playlist } = ctx.request.body
  ctx.body = Chanels.playlist(ctx.state.cid, playlist)
})

router.put('/:token/play', ctx => {
  const { sid } = ctx.headers
  const { play } = ctx.request.body
  ctx.body = Chanels.play(ctx.state.cid, play)
})

router.get('/:token', ctx => {
  const { sid } = ctx.headers
  ctx.body = {
    cid: Chanels.connect(ctx.state.cid, sid)
  }
})

router.del('/:token', ctx => {
  // const { sid } = ctx.headers
  // sokets.instance.destroyChanel(ctx.state.cid, sid)
})

module.exports = router.routes()
