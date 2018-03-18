const Router = require('koa-router')
const logger = require('koa-logger')
const body = require('koa-body')
const compose = require('koa-compose')
const glob = require('glob')

const { errorHandler, notFound } = require('../middleware/helpers')

const router = new Router()

router.use(logger())
router.use(body())

glob.sync(`./*/index.js`, { cwd: __dirname }).forEach(path => {
  const routes = require(path)
  router.use(routes)
})

router.get('/greatings', ctx => {
  ctx.body = 'Hello world!'
})

module.exports = compose([
  errorHandler,
  router.routes(),
  router.allowedMethods(),
  notFound
])
