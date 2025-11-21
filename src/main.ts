'use strict'

import 'dotenv/config'
import Hapi from '@hapi/hapi'
import joi from 'joi'
import { spawn } from 'node:child_process'
import JSONStream from 'JSONStream'
import bl from 'bl'
import { FFProbeStream } from 'ffprobe'

const init = async () => {
  const server = Hapi.server({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    debug: {
      log: ['*'],
      request: ['*'],
    },
  })

  server.route({
    method: 'get',
    path: '/',
    handler: (request, h) => {
      return h.response({
        name: process.env.APP_NAME,
        time: new Date(),
      })
    },
  })

  server.route({
    method: 'post',
    path: '/ffprobe',
    options: {
      validate: {
        payload: joi.object({
          url: joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        // https://github.com/eugeneware/ffprobe/blob/master/index.js
        let info: {
          streams: FFProbeStream[]
          format: {
            filename: string
            duration: string
            size: string
            bit_rate: string
            tags: {
              title?: string
              creation_time: string
            }
          }
        } = await new Promise((resolve, reject) => {
          let stdout: any, stderr: any

          let ffprobe = spawn(process.env.FFPROBE_PATH, [
            // prettier-ignore
            '-show_format',
            '-show_streams',
            '-print_format',
            'json',
            (request.payload as any).url,
          ])

          ffprobe.once('close', function (code) {
            if (!code) {
              resolve(stdout)
            } else {
              let err = stderr.split('\n').filter(Boolean).pop()
              reject(new Error(err))
            }
          })

          ffprobe.stderr.pipe(
            bl(function (err, data) {
              stderr = data.toString()
            }),
          )

          ffprobe.stdout.pipe(JSONStream.parse()).once('data', (row: any) => {
            stdout = row
          })
        })

        // @ts-ignore
        delete info.format.filename

        return h.response(info)
      } catch (e) {
        let error = `ffprobe error ${e}`
        request.log('error', error)
        return h.response(error).code(500)
      }
    },
  })

  await server.start()
  console.log('server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
