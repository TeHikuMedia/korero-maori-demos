<template>
  <div class="Korero">
    <div id="vadStatus" v-bind:class="{ active: vadOn }"></div>
    <button id="startVAD">{{buttonText}}</button>
    <div id="transcriptions"></div>
    <div id='audios'>
    </div>
  </div>

</template>

<script>
import VAD from '../lib/vad.js'
// import Recorder from 'opus-recorder'
import AudioRecorder from 'vue-audio-recorder'
import recorder from '../public/lib/recorder.js'
const axios = require('axios');
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      vadOn: false,
      recordingOn: false,
      recorder: null,
      buttonText: 'Start'
    }
  },
  mounted: function () {

    startVAD.onclick = event => {

      if (this.recorder==null){
        this.recorder = new recorder({
          putRecording : (record) => {
            console.log('putting')
            var xt = document.createElement('div')
            xt.innerText = 'Transcribbing...'
            transcriptions.appendChild(xt)            
            var formData = new FormData();
            formData.enctype="multipart/form-data";
            formData.append('audio_file', record.blob, 'audio_file.mp3')            
            axios.post(
              'https://corporalocal.io/api/transcription/?method=stream',
              // 'https://koreromaori.io/api/transcription/?method=stream',
              formData,
              {
                headers: {
                  Authorization: "Token 899f4739922881b0008716d7253269af9a77ca5e"},//0d0f9ebb85d621d7853052cd17f370e481379c6f"},
              },
              )
            .then(response => {
              xt.innerText = response.data.transcription
            })
            .catch(error => {
              console.log(error)
            })

          },
          afterRecording  : (stream) =>{

            startVAD.classList.remove('on')
            startVAD.classList.remove('on')
            
            this.buttonText = 'Start'

            audios.childNodes.forEach(function(i){audios.removeChild(i)})

            var records = this.recorder.recordList()
            for (var i = 0; i<records.length ; i++){
              console.log(records[i])
              var audio = document.createElement('audio')
              audio.controls = 'controls';
              audio.src =  records[i].url;
              audio.type = 'audio/mp3';
              audios.appendChild(audio)

            }
            
            this.recorder=null;
            


          },
          pauseRecording  : function(){console.log('paused')},
          micFailed       : function(){console.log('failed')},
          // bitRate         : 64,
          // sampleRate      : this.sampleRate,
          // format          : this.format
        })
      }

      if (startVAD.classList.contains('on')){
        this.recorder.stop();
        // startVAD.classList.remove('on')
        // this.recorder=null;
        // this.buttonText = 'Start'
      } else {
        this.recorder.start()
        startVAD.classList.add('on')
        this.buttonText = 'Stop'
      }
      
    // var vad = new VAD();

      
              
      // // Start the recording
      // window.setInterval(() => {
      //   if (this.vadOn && rec.isRecording){
      //     console.log('pass')
      //     //pass
      //   } else if (!this.vadOn && rec.isRecording) {
      //     console.log('stopping')
      //     rec.stop()
      //   } else if (this.vadOn && !rec.isRecording) {
      //     console.log('ERROR')
      //   } else if (!this.vadOn && !rec.isRecording) {
      //     rec.start()
      //     console.log('starting')
      //   }
      // }, 500)
      
        

        // // Create AudioContext
        // window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // var audioContext = new AudioContext();

        // var self = this;
        // // Define function called by getUserMedia 
        // var startUserMedia = (stream) => {
        //   // Create MediaStreamAudioSourceNode
        //   var source = audioContext.createMediaStreamSource(stream);

        //   // Setup options
        //   var options = {
        //    debug: true,
        //    source: source,
        //    voice_stop: function() {
        //     // vadStatus.classList.remove('active')

        //     rec.stop();
        //     self.vadOn = false
        //   }, 
        //    voice_start: function() {
        //     // vadStatus.classList.add('active')
        //     rec.start();
        //     self.vadOn = true
        //     self.recordingOn = true
            
        //     }
        //   }; 
          
        //   // Create VAD
        //   vad.contructor(options)

        // }

        // // Ask for audio device
        // navigator.getUserMedia = navigator.getUserMedia || 
        //                          navigator.mozGetUserMedia || 
        //                          navigator.webkitGetUserMedia;
        // navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        //         console.log("No live audio input in this browser: " + e);
        // });

      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#vadStatus {
  display: block;
  height: 100px;
  width: 100px;
  background-color: green;
}
#vadStatus.active{
  background-color: red;
}
</style>
