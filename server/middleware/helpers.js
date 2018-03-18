const { NotFound } = require('http-errors')

module.exports = {
  async errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.error(err)
      ctx.status = err.status || 500
      ctx.body = [{ message: err.message }]
    }
  },
  notFound(ctx) {
    throw new NotFound()
  }
}
