import { EmbedBuilder, WebhookClient } from 'discord.js'
import confid from '../configs/webhook'
import overides from './../configs/json/overides.json'
import type { FastifyRequest } from 'fastify'

class Hooks {
  errorClient: WebhookClient

  constructor () {
    this.errorClient = new WebhookClient({ id: confid.error_id, token: confid.error_token })
  }

  public ERROR_beforeExit (code: number): Promise<unknown> {
    if (overides.disableWebHooks === true) { return Promise.resolve() }
    if (overides.devMode === true) { return Promise.resolve() }

    const embed = new EmbedBuilder()
    embed.setTitle('SERVER SHUTTING DOWN')
    embed.addFields({ name: 'beforeExit', value: code.toString() })

    embed.setTimestamp()
    embed.setColor(0xFCBA03)

    return this.errorClient.send({ embeds: [embed] })
  }

  public ERROR_exit (code: number): Promise<unknown> {
    if (overides.disableWebHooks === true) { return Promise.resolve() }
    if (overides.devMode === true) { return Promise.resolve() }

    const embed = new EmbedBuilder()
    embed.setTitle('SERVER SHUT DOWN')
    embed.addFields({ name: 'exit', value: code.toString() })

    embed.setTimestamp()
    embed.setColor(0xFC0303)

    return this.errorClient.send({ embeds: [embed] })
  }

  public ERROR_unhandledRejection (reason: Error): Promise<unknown> {
    console.error('ERROR_unhandledRejection')
    console.error(reason)

    if (overides.disableWebHooks === true) { return Promise.resolve() }
    if (overides.devMode === true) { return Promise.resolve() }

    const embed = new EmbedBuilder()
    embed.setTitle('UNHANDLED REJECTION')
    embed.addFields({ name: reason.name, value: reason.message })
    if (reason.stack) {
      const body = reason.stack.substring(0, 2000)
      embed.setDescription(`\`\`\`js\n${body}\n\`\`\``)
    }
    embed.setTimestamp()
    embed.setColor(0xFC0303)

    return this.errorClient.send({ embeds: [embed] })
  }

  public ERROR_uncaughtException (reason: Error): Promise<unknown> {
    console.error('ERROR_uncaughtException')
    console.error(reason)

    if (overides.disableWebHooks === true) { return Promise.resolve() }
    if (overides.devMode === true) { return Promise.resolve() }

    const embed = new EmbedBuilder()
    embed.setTitle('UNHANDLED ERROR')
    embed.addFields({ name: reason.name, value: reason.message })
    if (reason.stack) {
      const body = reason.stack.substring(0, 2000)
      embed.setDescription(`\`\`\`js\n${body}\n\`\`\``)
    }
    embed.setTimestamp()
    embed.setColor(0xFC0303)

    return this.errorClient.send({ embeds: [embed] })
  }

  public ERROR_warning (warning: Error): Promise<unknown> {
    console.error('ERROR_warning')
    console.error(warning)

    if (overides.disableWebHooks === true) { return Promise.resolve() }
    if (overides.devMode === true) { return Promise.resolve() }

    const embed = new EmbedBuilder()
    embed.setTitle('SYSTEM WARNING')
    embed.addFields({ name: warning.name, value: warning.message })
    if (warning.stack) {
      const body = warning.stack.substring(0, 2000)
      embed.setDescription(`\`\`\`js\n${body}\n\`\`\``)
    }
    embed.setTimestamp()
    embed.setColor(0xFCAD03)

    return this.errorClient.send({ embeds: [embed] })
  }

  public routeError (req: FastifyRequest, error: Error): Promise<unknown> {
    console.error('routeError')
    console.error(error)

    if (overides.disableWebHooks === true) { return Promise.resolve() }
    if (overides.devMode === true) { return Promise.resolve() }

    if (error.message) {
      if (error.message === 'body must have required property \'hCaptchaToken\'') { return Promise.resolve() }
    }

    const embed = new EmbedBuilder()
    embed.addFields({ name: error.name, value: error.message.substring(0, 1000) })

    if (error.stack) {
      const body = error.stack.substring(0, 1900)
      embed.setDescription(`\`\`\`js\n${body}\n\`\`\``)
    }

    embed.setTimestamp()
    embed.setColor(0xFF0000)

    embed.addFields({ name: 'Route', value: req.url })
    embed.addFields({ name: 'IP', value: req.ip })

    const attachmentFiles: { attachment: Buffer, name: string }[] = []

    if (req.body) {
      attachmentFiles.push({ attachment: Buffer.from(JSON.stringify(req.body, null, 4)), name: 'request_body.json' })
    }

    return this.errorClient.send({ content: '.\n\n----- ROUTE ERROR -----', embeds: [embed], files: attachmentFiles })
  }
}

export default new Hooks()
