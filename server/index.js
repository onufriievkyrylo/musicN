const Koa = require('koa')
const mount = require('koa-mount')
const static = require('koa-static')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const sockets = require('./sockets')

const api = require('./api')

async function main() {
  const app = new Koa()
  const port = process.env.PORT || 3000
  config.dev = app.env === 'development'

  const nuxt = new Nuxt(config)

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(mount('/uploads', static(`${__dirname}/../uploads`, { 
    setHeaders(res) {
      res.setHeader('Accept-Ranges', 'bytes')
    }
   })));

  app.use(mount('/api', api))

  app.use(async (ctx, next) => {
    await next()
    ctx.status = 200
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      return nuxt.render(ctx.req, ctx.res)
    })
  })

  const server = app.listen(port)
  sockets.create(server)
  console.log(`Server listening on post - ${port}`)
}

main()
