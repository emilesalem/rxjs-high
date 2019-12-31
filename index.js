const cluster = require('cluster')

const metricsServer = require('./school/metrics')
const { gauge } = require('./school/metrics/collector')

metricsServer()

cluster.setupMaster({
  exec: 'school/start.js'
})

const school = cluster.fork()

cluster.setupMaster({
  exec: 'school/kids.js'
})

const kids = cluster.fork()

kids.on('message', x => school.send(x))

school.on('message', x => gauge.labels(x.label)[x.type]())
