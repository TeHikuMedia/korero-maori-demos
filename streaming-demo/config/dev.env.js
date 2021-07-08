'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ASR_WEBSOCKET_ENDPOINT: '"wss://asr.koreromaori.io/stt"'
})
