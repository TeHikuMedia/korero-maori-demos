<template>
  <div class="main">
    <!-- <div class="row"> -->
      <div class="piki">
        <canvas @click='togglePiki' id="canvas" width="300px" height="300px"></canvas>
      </div>
    <!-- </div> -->
    <!-- <div class="row"> -->
      <div class="aria-text">
        <transition name="slide-fade" mode="out-in">
          <div :key="welcome_message" class="text">
            {{ welcome_message }}
          </div>
        </transition>
      </div>
      <audio id="audio" autoplay @ended="audioEnded" crossorigin="anonymous">
        <source :src="item.url" :type="item.type" v-for="item in sources">
      </audio>
    <!-- </div> -->
    <Media v-bind:media="mediaData" v-bind:mediaURL='mediaURL'></Media>
  </div>
</template>
<script>
const domain = 'https://tts.koreromaori.io'
import recorder from '../lib/recorder.js'
import isMobile from '../lib/isMobile.js'
const axios = require('axios');
const ApiAuth = require('../../api_auth')
const api_auth = ApiAuth.api_auth;
import vis from '../lib/visCircle.js'
const levenshtein = require('js-levenshtein');
import commands from './commands.js'

const speechCommands = commands['commands']
import Media from './Media'

export default {
  name: 'Piki',
  components: {
    Media,
  },
  data () {
    return {
      welcome_message: '',
      welcomed: false,
      welcome: [
        'Tēnā koe.',
        'Ko Piki tōku ingoa.',
        // 'E kōrero ana mai, e hoa.',
        // 'Mauria mai tō pātai.',
        // "E kōrero ana koe, 'he aha ngā take o te tai tokerau.'",
        // "E kōreo hoki, 'whakapāhongia ki te reo irirangi o te hiku.",
        "Kōrero mai."
      ],
      sources: [],
      audioCtx: null,
      audio: null,
      audioSrc: null,
      recorder: null,
      transcription: null,
      vis: null,
      mediaData: null,
      mediaURL: null,
      isResponding: false,
      piki: false,
    }
  },
  methods: {
    getCommand: function(command){
      console.log(`Getting ${command.action}`)
      console.log(`Getting ${command.url}`)
      console.log(`Getting ${command.method}`)
      console.log(`Getting ${command.media_url}`)
      if ('url' in command){
        let y = new XMLHttpRequest()
        y.onload = () => {
          let d = JSON.parse(y.response)
          this.mediaData = d
          this.mediaURL = command.media_url
          console.log(this.mediaData)
          this.startVAD()
        }
        y.open('GET', command.url)
        y.send()
      } else if ('method' in command){
        console.log('EXECUTING METHOD')
        console.log(command.method())
        // text = f()
        // console.log(text)
        var result = command.method()
        command.response = result.response
        this.mediaData = {
          headline: result.time,
          media: [{media_type: 'N'}]
        }
        this.isResponding = true
      } else if ('response' in command){
        this.isResponding = true
      }
      
    },
    checkCommand: function(command){
      console.log(command)
      let results = {}
      let BreakException = {};

      try{
        speechCommands.forEach((c)=>{
          c.phrases.forEach((p)=>{
            let diff = levenshtein(command, p)
            let conf = Math.round((1.0 - diff/p.length)*100)
            if (!(`${conf}` in results)){ results[`${conf}`] = [] }
            

            if (conf>75){
              console.log(conf)
              console.log(p)
            }
            results[`${conf}`].push({'p': p, 'c': c})
            
            if (conf>=95){
              // If 95% match or better then execute immediately
              console.log(`CONFIDENCE: ${conf}`)
              this.getCommand(c)
              this.synthesize(c.response)
              throw BreakException;
            } else if (p.search(command)>=0 && conf>=75){
              // The entire transcribed command is in the command and > 75%
              this.getCommand(c)
              this.synthesize(c.response)
              throw BreakException;
            }
          })
        })

        console.log('no perfect match seaching for best match')

        for (var i=94; i>=75; i--){
          if (results[i] !== undefined){
            let r = results[i]
            if (r.length==1){
              console.log('FOUND MATCH')
              console.log(`CONFIDENCE: ${i}`)
              console.log(r)
              this.getCommand(r[0]['c'])
              this.synthesize(r[0]['c'].response)
              throw BreakException;
            } else if (r.length>1){
              console.log('MULTIPLE WITH SAME CONFIDENCE')
              if (levenshtein(r[0]['p'],r[1]['p'])/r[1]['p'].length <= .1){
                console.log(`CONFIDENCE: ${i}`)
                console.log(r)
                this.getCommand(r[0]['c'])
                this.synthesize(r[0]['c'].response)
              }
            }
          } else{
            console.log(results[i])
          }
        }

      } catch(e){
        if (e !== BreakException) throw e;
      }

    },
    audioEnded: function(){
      // this.audio=null
      this.vis.stop()
      if (!this.welcomed && this.welcome.length >0 ){
        this.sources = []
        this.welcome_message = ''
        window.setTimeout(this.show_welcome, 500)
      } else if (!this.welcomed && this.welcome.length == 0){
        this.welcomed = true
        this.welcome_message = ''
        this.vis.setColor('#03a9f4')
      } else {
        this.vis.setColor('#03a9f4')
      }

      if (this.welcomed){
        this.startVAD()
      }

      if (this.isResponding){
        console.log('responded')
        this.isResponding = false
        this.startVAD()
      }
      
    },
    show_welcome: function(){
      let text = this.welcome.shift()

      this.welcome_message = text
      console.log(text)
      this.synthesize(text)
    },
    synthesize: function(text){
      let x = new XMLHttpRequest()
      x.onload = () => {
        this.sources = null
        let d = JSON.parse(x.response)
        let sources = []
        if (d.wav){
          sources.push({'type': 'audio/wav', 'url': domain + d.wav})
        }
        if (d.mp4){
          sources.push({'type': 'audio/mp4', 'url': domain + d.mp4})
        }
        this.sources = sources
        try{
          this.vis.setColor('#dc2250')
          this.audio.load()
          this.audio.play()
          this.vis.start()
        } catch(e){
          console.log(e)
        }
      }

      x.onerror = () => {
        this.audioEnded()
      }

      x.open("GET", domain + '/synth/'+text)
      x.send()
      this.welcome_message = text
    },
    setupVisualise: function(){
      this.vis = new vis({'color': '#dc2250'});
      this.vis.init('canvas', this.audioSrc, this.audioCtx)
    },
    startVAD: function(){
      // this.vis.disconnectAudio()
      if (this.recorder==null){
        this.loadRecording = true
        this.recorder = new recorder({
          putRecording : (record) => {
            var transcription = {
              status: 'Transcribing',
              text: null,
              audio: null,
            }
            this.transcription = transcription
            var formData = new FormData();
            formData.enctype="multipart/form-data";
            formData.append('audio_file', record.blob, 'audio_file.mp3')            
            axios.post(
              api_auth['url'],
              formData,
              {
                headers: api_auth['headers'],
              })
            .then((response) => {
              if (response.data.transcription == '' || response.data.transcription == ' ' ){
                transcription.status = 'Failed'
                return
              }
              transcription['text'] = response.data.transcription
              if (transcription['text'].length< 4){
                return
              }
              transcription['show_metadata'] = false
              if (response.data.metadata){
                console.log('getting response.data.metadata')
                transcription['show_metadata'] = true
                transcription['metadata'] = response.data.metadata

                var words = []
                var probs = []
                var prob = []
                var word = ''
                var start = 0
                for (var i=0; i <response.data.metadata.length; i++){
                  word = word + response.data.metadata[i].char
                  prob.push(response.data.metadata[i].prob)
                  if (response.data.metadata[i].char != ' '){
                    continue
                  } else {
                    words.push({'word': word, 'prob': this.p_word(prob)})
                    prob = []
                    start = i
                    word = ''
                  }
                } 
                words.push({'word': word, 'prob': this.p_word(prob)})
                console.log(words)
                transcription['words'] = words
                console.log(transcription['metadata'])
              } else {
                console.log('NO response.data.metadata')
              }
              
              transcription['audio_url'] = record.url
              transcription['status'] = 'Success'
              this.checkCommand(transcription['text'])
            })
            .catch((error) => {
              transcription.status = 'Failed'
            })
          },
          afterRecording  : (stream) =>{
            this.buttonText = 'Start'            
            this.recorder=null;
          },
          pauseRecording  : function(){console.log('paused')},
          micFailed       : function(){console.log('failed')},
          voiceStop: () => {
            this.vadOn = false
            this.vis.stop()
          },
          voiceStart: () => {
            this.vadOn = true
            this.vis.start()
          },
          canvasID: 'canvas',
          bitRate         : 64,
          sampleRate      : 44100,
          visClass        : this.vis,
        })
      }

      if (this.recordingOn){
        this.recorder.stop();
        this.recorder=null;
        this.vadOn = false;
        this.recordingOn = false
      } else {
        this.recorder.start()
        this.recordingOn = true
        this.buttonText = 'Stop'
        this.loadRecording = false
      }
    },
    togglePiki: function(){
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext("2d")      
      if (!this.welcomed){
        this.piki = true
        this.audioCtx.resume()
        this.show_welcome()
      } else if (this.piki){
        this.vis.setColor('#03a9f4')
        console.log('no piki')
        this.audioCtx.suspend()
        try{this.recorder.stop()}catch(e){}
        this.recordingOn=false
        this.vis.stop()
        
        ctx.beginPath();
        ctx.fillStyle = '#000'
        ctx.arc(150, 150, 150, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#dc2250'
        ctx.arc(150, 150, 10, 0, Math.PI*2);
        ctx.fill();
        this.piki = false
      } else {
        this.vis.setColor('#03a9f4')
        console.log(' piki')
        this.audioCtx.resume()
        this.piki = true
        this.startVAD()
        this.vis.start()
        ctx.beginPath();
        ctx.fillStyle = '#000'
        ctx.arc(150, 150, 150, 0, Math.PI*2);
        ctx.fill();
        
      }
    },
  },
  created: function(){
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var welcomed = false //localStorage.getItem('welcomed');
    if (!welcomed){
      // localStorage.setItem('welcomed', true)
    }

  },
  mounted: function(){
    var welcomed = localStorage.getItem('welcomed');
    if (welcomed==undefined){
      this.welcomed = false
    } else {
      this.welcomed = true
    }
    this.welcomed = false
    this.audio = document.getElementById('audio')
    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
    this.setupVisualise()
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext("2d")
      ctx.beginPath();
      ctx.fillStyle = '#dc2250'
      ctx.arc(150, 150, 10, 0, Math.PI*2);
      ctx.fill();
      // canvas.onclick = () => {
      //   this.audioCtx.resume()
      //   this.piki = true
      //   this.show_welcome()
      //   canvas.onclick = this.togglePiki
      // }
      // window.setTimeout(, 2000)
    // }
  },
}

</script>

<style scoped lang="scss">
div.main{
  background-color: black;
  width: 100%;
  height: 100%;
  display: flex;
  align-self: center;
  justify-content: center;
  flex-wrap: wrap;
      justify-content: center;
    align-content: flex-start;

}
div.piki{
  text-align: center;
  break-after: always;
  background-color: black;
  border-radius: 150px;
  width: 300px;
  height: 300px;
  flex-basis: 100%;
  canvas{
    width: 300px;
    height: 300px;
  }
}

div.aria-text{
  color: white;
  font-family: sans-serif;
  font-size: 16pt;
  padding: 0px 15px;
  flex-basis: 100%;
  text-align: center;
}

.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(20px);
  opacity: 0;
}



</style>
