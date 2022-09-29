import { FastifyReply, FastifyRequest } from 'fastify'
import promClient, { Summary } from 'prom-client'
import { Getters } from './helpers'

class Prometheus {
  client: typeof promClient
  prefix: string
  responses: promClient.Summary<'path' | 'method' | 'status'>

  constructor () {
    this.client = promClient
    this.prefix = 'chorus_'
  }

  init () {
    this.responses = new Summary({ name: `${this.prefix}_responses`, help: 'Response time in millis', labelNames: ['method', 'path', 'status'] })
    this.client.collectDefaultMetrics()
  }

  responseCounters (req: FastifyRequest, res: FastifyReply, time: number) {
    if (!Getters.isProduction) {
      // eslint-disable-next-line no-console
      console.log(`[${res.statusCode}] ${time} ${req.routerPath}`)
    }

    if (req.url === '/api/v1/internal/metrics') { return }
    this.responses.labels(req.method, req.routerPath, res.statusCode.toString()).observe(time)
  }
}

export default new Prometheus()
