
export default class {

  constructor(options = {}){
    this.color = options.color || '#3f51b5'
  }

  init(canvas_id, sourceNode, audioContext, recording=false){
    var self = this
    this.canvas = document.getElementById(canvas_id)
    this.canvasContext = this.canvas.getContext("2d")
    this.loop = false
    this.sourceNode = sourceNode
    this.audioContext = audioContext
    this.analyser = audioContext.createAnalyser()
    this.analyser.fftSize = 1024


    this.sourceNode.connect(this.analyser)
    this.bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
    
    if (!recording){
      this.outputAudio()
    }
  }

  outputAudio(){
    this.analyser.connect(this.audioContext.destination)
  }

  disconnectAudio(){
    console.log('disconnecting')
    // this.sourceNode.disconnect(this.analyser)
    // this.audioContext.destination.disconnect()
    this.analyser.disconnect()
    // this.sourceNode.connect(this.analyser)

  }

  stop(){
    this.loop = false
    this.clearFrame()
    console.log('stop')
    window.requestAnimationFrame(()=>{})
  }

  start(){
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;    
    this.WIDTH = this.canvas.clientWidth;
    this.HEIGHT = this.canvas.clientHeight; 
    this.MINR = this.WIDTH/20
    this.PERIOD = this.bufferLength/(16*Math.PI)
    this.clearFrame()
    
    this.loop = true
    this.renderFrame();
  }

  renderFrame() {
    
    if (this.loop){
      
        window.requestAnimationFrame(()=>{this.renderFrame()});
        this.analyser.getByteFrequencyData(this.dataArray);        
        this.clearFrame()

        this.canvasContext.strokeStyle = this.color;
        this.canvasContext.lineWidth = 1.5;
        this.canvasContext.beginPath();
        
        for (var j=0; j<=this.dataArray.length; j++){
          
          let r = Math.log(Math.abs(this.dataArray[j])/255+1) * 120 // radius
          let o = j/this.PERIOD - Math.PI/2 // radians
          let l = r-100
          if (r<this.MINR){
            r = this.MINR
            l = r-1
          } else {
            if (l<this.MINR){
              l = this.MINR
            }
          }
          let y = r*Math.sin(o)
          let x = r*Math.cos(o)
          let y1 = (l)*Math.sin(o)
          let x1 = (l)*Math.cos(o)

          // Start a new path
          this.canvasContext.beginPath();
          this.canvasContext.moveTo(this.WIDTH/2+x1, this.HEIGHT/2+y1);    // Move the pen to (30, 50)
          this.canvasContext.lineTo(this.WIDTH/2+x, this.HEIGHT/2+y);  // Draw a line to (150, 100)
          this.canvasContext.stroke(); 
        }
      
    } else {
      return;
    }
  }

  clearFrame(){
    this.canvasContext.fillStyle = "rgba(0,0,0,1)";
    this.canvasContext.arc(150, 150, 150, 0, Math.PI*2);
    this.canvasContext.fill();

    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = this.color;
    this.canvasContext.lineWidth = 1.5;
    this.canvasContext.arc(150, 150, this.MINR, 0, Math.PI*2);
    this.canvasContext.stroke()
  }

  setColor(s){
    this.color=s
  }

}
