import Encoder from './encoder'
import { convertTimeMMSS } from '../../../node_modules/vue-audio-recorder/src/lib/utils'
import VAD from '../../lib/vad.js'

export default class {
  constructor (options = {}) {
    this.beforeRecording = options.beforeRecording
    this.pauseRecording  = options.pauseRecording
    this.putRecording    = options.putRecording
    this.afterRecording  = options.afterRecording
    this.micFailed       = options.micFailed

    this.bufferSize = 4096
    this.records    = []

    this.isPause     = false
    this.isRecording = false

    this.duration = 0
    this.volume   = 0

    this._duration = 0

    this.vad = new VAD();
    this.activity = false;
    this.flush = false;
  }

  start () {
    const constraints = {
      video: false,
      audio: {
        channelCount: 1,
        echoCancellation: true
      }
    }

    this.beforeRecording && this.beforeRecording('start recording')

    navigator.mediaDevices
             .getUserMedia(constraints)
             .then(this._micCaptured.bind(this))
             .catch(this._micError.bind(this))
    this.isPause = false
    this.isRecording = true
    this.lameEncoder = new Encoder({})
  }

  stop () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
    this.context.close()

    const record = this.lameEncoder.finish()
    record.duration = convertTimeMMSS(this.duration)
    // this.records.push(record)

    this._duration = 0
    this.duration  = 0

    this.isPause     = false
    this.isRecording = false

    this.afterRecording && this.afterRecording(record)
  }

  put () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
    this.context.close()

    const record = this.lameEncoder.finish()
    record.duration = convertTimeMMSS(this.duration)
    this.records.push(record)

    this._duration = 0
    this.duration  = 0

    this.isPause     = false
    this.isRecording = false
    this.putRecording && this.putRecording(record)

  }

  pause () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
    this.context.close()

    this._duration = this.duration
    this.isPause = true

    this.pauseRecording && this.pauseRecording('pause recording')
  }

  recordList () {
    return this.records
  }

  lastRecord () {
    return this.records.slice(-1)
  }

  _micCaptured (stream) {
    this.context    = new(window.AudioContext || window.webkitAudioContext)()
    this.duration   = this._duration
    this.input      = this.context.createMediaStreamSource(stream)
    this.processor  = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.stream     = stream

    this.voiceStop = () => {
      console.log('stopped')
      this.activity = false
      this.put()
      this.start()
    }
    this.voiceStart = () => {
      console.log('started')
      this.activity = true
      this.flush = true
    }

    var options = {
      debug: true,
      source: this.input,
      voice_stop: this.voiceStop,
      voice_start: this.voiceStart,
    }; 
        
    // Create VAD
    this.vad.contructor(options)

    this.processor.onaudioprocess = (ev) => {
      if (this.activity){
        if (this.flush){
          this.lameEncoder.flushPrevious(10*4)
          this.flush = false
        }
        console.log('active')
      } else {
        console.log('inactive')
      }
      const sample = ev.inputBuffer.getChannelData(0)
      let sum = 0.0

      this.lameEncoder.encode(sample)

      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i]
      }

      this.duration = parseFloat(this._duration) + parseFloat(this.context.currentTime.toFixed(2))
      this.volume = Math.sqrt(sum / sample.length).toFixed(2)
    }

    this.input.connect(this.processor)
    this.processor.connect(this.context.destination)
  }

  _micError (error) {
    this.micFailed && this.micFailed(error)
  }
}
