const Koa = require('koa')

const metrics = require('./collector')

function serveMetrics () {
  const app = new Koa()

  app.use(async (ctx, next) => {
    if (ctx.path !== '/metrics') {
      ctx.status = 404
      return
    }
    ctx.type = metrics.collector.output.contentType()
    ctx.body = metrics.collector.output.content()
  })

  app.listen(3002)
}

module.exports = serveMetrics
