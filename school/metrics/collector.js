const prometheus = require('prom-client')

const gauge = new prometheus.Gauge({
  name: 'rxjs_high_pipeline_throughput',
  help: 'rxjs high metrics',
  labelNames: ['pipe']
})

prometheus.collectDefaultMetrics()

const collector = {
  output: {
    contentType: () => prometheus.register.contentType,
    content: () => prometheus.register.metrics()
  }
}

module.exports = {
  collector,
  gauge
}
