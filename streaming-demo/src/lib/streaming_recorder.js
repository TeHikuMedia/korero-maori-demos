import Resampler from './resampler'
import VAD from './vad.js'
import vis from './visualise'

export default class {
  constructor (options = {}) {
    this.beforeRecording   = options.beforeRecording
    this.pauseRecording    = options.pauseRecording
    this.processAudio      = options.processAudio
    this.afterRecording    = options.afterRecording
    this.micFailed         = options.micFailed
    this.voiceStop         = options.voiceStop
    this.voiceStart        = options.voiceStart
    this.visCanvasID       = options.canvasID || null

    this.bitRate = options.bitRate || 96
    this.sampleRate = options.sampleRate || 44100
    this.bufferSize = 4096
    this.records    = []

    this.sampler = new Resampler(this.sampleRate, 16000, 1, this.bufferSize)

    this.isPause     = false
    this.isRecording = false

    this.volume   = 0

    this.vad = null
    this.vis = null
    this.activity = false

    this.vis = null

    // Set Sample Rate according to device and browser campability
    this.context = new(window.AudioContext || window.webkitAudioContext)()
    this.sampleRate = this.context.sampleRate
    this.context.close()
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

  }

  stop () {
    if (this.vis){
      this.vis.stop()
    }

    // this.stream.getTracks().forEach((track) => track.stop())
    // this.input.disconnect()
    if (this.processor)
      this.processor.disconnect()
    if (this.context)
      this.context.close()

    this.isPause     = false
    this.isRecording = false

    
  }

  pause () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
    this.context.close()

    this.isPause = true

    this.pauseRecording && this.pauseRecording('pause recording')
  }

  recordList () {
    return this.records
  }

  lastRecord () {
    return this.records.slice(-1)
  }

  _floatTo16BitPCM(input, output) {
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]))
      output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF)
    }
  }

  _convertTo16BitPCM(arrayBuffer) {
    const data = new Float32Array(arrayBuffer)
    const out = new Int16Array(arrayBuffer.length)
    this._floatTo16BitPCM(data, out)
    return out
  }

  _micCaptured (stream) {
    this.context    = new(window.AudioContext || window.webkitAudioContext)({sampleRate: this.sampleRate})
    this.input      = this.context.createMediaStreamSource(stream)
    this.processor  = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.stream     = stream

    this._voiceStop = () => {
      this.voiceStop()
      this.activity = false
      if (this.afterRecording) {
          this.afterRecording();
      }
    }
    this._voiceStart = () => {
      this.voiceStart()
      this.activity = true
    }

    // Create VAD
    var options = {
      debug: false,
      source: this.input,
      voice_stop: this._voiceStop,
      voice_start: this._voiceStart,
    };         
    this.vad = new VAD(options)
    
    // create visualisation
    if (this.visCanvasID){
      try{
        this.vis = new vis(this.visCanvasID, this.input, this.input.context)
        this.vis.start()
      } catch(error){
        console.log(error)
      }
    }

    this.processor.onaudioprocess = (ev) => {
      var sample = ev.inputBuffer.getChannelData(0);

      //work out volume
      let sum = 0.0
      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i]
      }
      this.volume = Math.sqrt(sum / sample.length).toFixed(2)

      // streaming callback to processAudio 
      // - if we're in voice detection and the callback is defined
      if (this.activity) {
        if (this.processAudio) {
            var resampled = this.sampler.resampler(sample);
            var buffer = this._convertTo16BitPCM(resampled)
            this.processAudio(buffer);
        }
      }
    }

    this.input.connect(this.processor)
    this.processor.connect(this.context.destination)
  }

  _micError (error) {
    this.micFailed && this.micFailed(error)
  }
}
