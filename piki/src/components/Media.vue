<template>
  <div class="main" v-if="media">
    <div class="wrapper">
      <transition name="slide-fade" mode="out-in">
        <div  class="media" :key="media.headline">
          <h1 :key="media.headline">{{media.headline}}</h1>
          <p :key="media.summary">{{media.summary}}</p>
          <img :key="media.image_thumb" :src="media.image_thumb" v-if="media.media[0].media_type=='A'" >
          <audio 
            autoplay id="mediaAudio" 
            controls v-if="media.media[0].media_type=='A'" 
            :src="media.media[0].media_file" >
          </audio>
          <div style="position:relative;padding-top:56.25%;width:100%;" v-if="media.media[0].media_type=='V'">
            <iframe
                id="mediaVideo"
                
                :src="media.media[0].embed_url" width='100%' height='281px'
                style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Media',
  props: {
    media: {
      type: Object
    },
    mediaURL: {
      type: String
    }
  },
  data () {
    return {
      src: null,
      type: null,
    }
  },
  watch: {
    media: function(val, oldVal){
      console.log('Wacted')
      if (val.image_thumb==undefined){
        // val.image_thumb = 'https://tehiku.nz/' + val.logo
      }
      if (val.headline==undefined){
        val.headline = val.name
      }
      if (val.media==undefined){
        val.media=[{'media_file': this.mediaURL, 'media_type': 'A'}]
      }
      if (val.media[0].media_type=='A'){
        window.setTimeout(function(){
          document.getElementById('mediaAudio').play()
        }, 500)
      } else if (val.media[0].media_type=='V'){
        window.setTimeout(function(){
          var elm = document.getElementById('mediaVideo')
        }, 100)
      }
      
    }
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
div.main{
  height: 0;
  margin: 15px;
  font-family: sans-serif;
  width: 100%;
  text-align: center;
  > div.wrapper {
    margin: 0px;
    display: inline-block;
    text-align: left;
    border-radius: 10px;
    padding: 15px;
    background-color: white;
    width: 100%;
    max-width: 500px;
    > div.media{

        h1{
          margin-top: 0px;
        }
        img{
          width:100%;
        }
        audio{
          width: 100%;
          margin-top: 15px;
          outline: none;
        }
      }
  }
  
}
iframe{
  border: 0px;
  width: 100%;
}
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(20px);
  opacity: 0;
}
</style>