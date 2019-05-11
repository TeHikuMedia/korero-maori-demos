<template>
  <div class="Korero">
    <div class="header">
      <button id="startVAD">{{buttonText}}</button>
      <div id="vadStatus" v-bind:class="{ active: vadOn }">
        <canvas id="canvas"></canvas>
      </div>
    </div>

    <div class="body">
      <div id="transcriptions">
        <div v-for="(item, index) in transcriptions" class='transcription' v-if="item.status != 'Failed'"> 
          <button class="delete"  v-on:click="deleteObject(index)">delete</button>
          <div v-if="item.status == 'Transcribing'" class="text">
            {{item.status}}
          </div>
          <div v-if="item.text" class='text'>
            {{item.text}}
          </div>
          <div class="audio">
            <audio v-if="item.audio_url" :src="item.audio_url" type="audio/mp3" controls></audio>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import recorder from '../public/lib/recorder.js'
const ApiAuth = require('../../api_auth')
const api_auth = ApiAuth.api_auth;
const axios = require('axios');
export default {
  name: 'Kōrero',
  data () {
    return {
      vadOn: false,
      recordingOn: false,
      recorder: null,
      buttonText: 'Start',
      transcriptions: [],
    }
  },
  methods: {
    deleteObject: function (e) {
      this.transcriptions.splice(e, 1)
    },
  },
  mounted: function () {

    startVAD.onclick = event => {

      if (this.recorder==null){
        this.recorder = new recorder({
          putRecording : (record) => {
            var transcription = {
              status: 'Transcribing',
              text: null,
              audio: null,
            }
            this.transcriptions.unshift(transcription)

            console.log(api_auth)
            // var div = document.createElement('div')
            // var xt = document.createElement('div')
            // xt.innerText = 'Transcribing...'
            // div.classList.add('transcription')
            // xt.classList.add('text')
            // // div.append(xt)
            // transcriptions.insertBefore(div, transcriptions.firstChild)
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
                // div.remove()
                this.transcriptions.pop(0)
                transcription.status = 'Failed'
                // transcription.delete()
                return
              }
              // xt.innerText = response.data.transcription
              transcription['text'] = response.data.transcription
              transcription['audio_url'] = record.url
              transcription['status'] = 'Success'
              // var audio = document.createElement('audio')
              // audio.controls = 'controls';
              // audio.src =  record.url;
              // audio.type = 'audio/mp3';
              // // div.append(audio)



            })
            .catch((error) => {
              transcription.status = 'Failed'
              // transcription.delete()
              this.transcriptions.pop(0)
            })

          },
          afterRecording  : (stream) =>{
            startVAD.classList.remove('on')
            this.buttonText = 'Start'            
            this.recorder=null;
          },
          pauseRecording  : function(){console.log('paused')},
          micFailed       : function(){console.log('failed')},
          voiceStop: () => {
            
            this.vadOn = false
          },
          voiceStart: () => {
            this.vadOn = true

          },
          canvasID: 'canvas',
          bitRate         : 64,
          sampleRate      : 44100,
          // format          : this.format
        })
      }

      if (startVAD.classList.contains('on')){
        this.recorder.stop();
        startVAD.classList.remove('on')
        this.recorder=null;
        this.vadOn = false;
        // this.buttonText = 'Start'
      } else {
        this.recorder.start()
        startVAD.classList.add('on')
        this.buttonText = 'Stop'
      }
      

      }
  }
}
</script>

<style scoped>
button.delete{
  position: absolute;
  right: 0px;
  top: 0px;
  display: block;
  margin: 15px;  
}
.transcription{
  position: relative;
  width: 100%;
  margin: 20px 30px 20px 30px;
  max-width: 500px;
  /*margin-top: 20px; */
  font-size: 1.5em;
  border-radius: 8px;
  /*box-shadow: 0px 2px 6px -2px rgba(0,0,0,1)  */
  border: 1px solid black;
}

.transcription .text {
  padding-top: 15px;
  padding-bottom: 15px
}

.Korero, .header, .body{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.body{
  height: 100vh;
  margin-top: -463px;
  padding-top: 250px;
}
.header{
  padding-bottom: 15px;
  z-index: 1;
  background-color: white;
  /*box-shadow: 0 -2px 10px black;*/
  border-bottom: 2px solid black;
}
#transcriptions{
  z-index: 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar; 
  align-items: center;  
  margin-top: 215px;
  height: 100vh;    
  /*border-top: 2px solid black;*/
}

#vadStatus{
  display: flex;
  width: 100%;
  max-width: 560px;  
  height: 100px;
  align-self: center;
  align-items: center;
  border: 4px solid black;
  border-radius: 4px;

}
#vadStatus.active{
  background-color: red;
  border: 4px solid red;
}
#vadStatus canvas{
  z-index: 1;
  display: block;
  height: 100%;
  width: 100%;
  background-color: #333;
}
#startVAD {
  z-index: 2;
  align-self: center;
  margin: 15px;
  outline: none;
  background-color: rgb(40,40,40);
  color: white;
  width: 150px;
  font-size: 2em;
  border: 2px solid black;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
#startVAD.on {
  background-color: rgb(255, 40, 40);
  border-color: rgb(200, 40, 40);;
}
audio{
  outline: none;
  width: 100%;
  padding-bottom: 15px;
}
.audio{
  padding: 0px 15px 0px 15px;
}
</style>
