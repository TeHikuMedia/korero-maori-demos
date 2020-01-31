import argparse
import math
import shutil
import numpy as np
import pyaudio
import threading, collections, queue, os, os.path
import samplerate as sr
import webrtcvad
import sys
from halo import Halo
import sounddevice as sd
import logging
from lomond import WebSocket, events

logger = logging.getLogger(__name__)
logging.basicConfig(level=30,
    format="%(asctime)s.%(msecs)03d: %(name)s: %(levelname)s: %(funcName)s(): %(message)s",
    datefmt="%Y-%m-%d %p %I:%M:%S",
    )
logging.getLogger('lomond').setLevel(30)
STOP = False

def print_output(*args):
    if logger.isEnabledFor(40):
        print(*args)

class SpectrogramAudioSource(object):

    def __init__(self, 
            device, 
            gain, 
            low,
            high, 
            columns, 
            block_duration_ms,
            enable_spectrogram=False,
            full_buffer_callback=None, 
            buffer_s=0, 
            flush_queue=True):
        
        samplerate = 16000
        self.pending_response = False
        self.device = device
        self.gain = gain
        self.full_buffer_callback = full_buffer_callback
        
        # Create a nice output gradient using ANSI escape sequences.
        # Stolen from https://gist.github.com/maurisvh/df919538bcef391bc89f
        self.enable_spectrogram = enable_spectrogram
        self.columns=columns

        delta_f = (high - low) / (self.columns - 1)
        self.fftsize = math.ceil(samplerate / delta_f)
        self.low_bin = math.floor(low / delta_f)


        colors = 30, 34, 35, 91, 93, 97
        chars = ' :%#\t#%:'
        self.gradient = []
        for bg, fg in zip(colors, colors[1:]):
            for char in chars:
                if char == '\t':
                    bg, fg = fg, bg
                else:
                    self.gradient.append('\x1b[{};{}m{}'.format(fg, bg + 10, char))


        #samplerate = sd.query_devices(device, 'input')['default_samplerate']
        self.samplerate = samplerate
        self.flush_queue = flush_queue
        self.buffer_queue = queue.Queue(maxsize=(buffer_s * 1000 // block_duration_ms))
        self.block_duration_ms = block_duration_ms
        self.active = False
        self.stream = None


    def _callback(self, indata, frames, time, status):

        global STOP
        if STOP:
            raise Exception("Stopped")

        if status:
            text = ' ' + str(status) + ' '
            print('\x1b[34;40m', text.center(self.columns, '#'),
                  '\x1b[0m', sep='')
        if any(indata):


            self.buffer_queue.put(indata, block=False) # 'block=False' here means non-blocking, async call
            
            if self.enable_spectrogram and not self.pending_response:
                magnitude = np.abs(np.fft.rfft(indata[:, 0], n=self.fftsize))
                magnitude *= self.gain / self.fftsize
                line = (self.gradient[int(np.clip(x, 0, 1) * (len(self.gradient) - 1))]
                        for x in magnitude[self.low_bin:self.low_bin + self.columns])
                print(*line, sep='', end='\x1b[0m\n')
                #print(indata.max())                
            
            if self.full_buffer_callback is not None and self.buffer_queue.qsize()>30:
                buff = [] #collections.deque(maxlen=50)
                for i in range(30):
                    block = self.buffer_queue.get()
                    self.buffer_queue.task_done()
                    buff.append(block)
                self.full_buffer_callback(np.concatenate(buff))
               
        else:
            print('no input')


    def listen(self):
        self.active = True

        self.stream = sd.InputStream(device=self.device, channels=1, callback=self._callback,
                            dtype=np.int16, blocksize=int(self.samplerate * self.block_duration_ms / 1000),
                            samplerate=self.samplerate)
        self.stream.start()
        while True:
            response = input()
            if response in ('', 'q', 'Q'):
                break
            for ch in response:
                if ch == '+':
                    self.gain *= 2
                elif ch == '-':
                    self.gain /= 2
                

    def destroy(self):
        if self.stream:
            self.stream.stop()

        self.active = False

    def read(self):
        """Return a block of audio data, blocking if necessary."""
        if self.active or (self.flush_queue and not self.buffer_queue.empty()):
            return self.buffer_queue.get()
        else:
            return None

    def read_loop(self, callback):
        """Block looping reading, repeatedly passing a block of audio data to callback."""
        for block in iter(self):
            callback(block)

    def __iter__(self):
        """Generator that yields all audio blocks from microphone."""
        while True:
            block = self.read()
            if block is None:
                break
            yield block



class VADAudioSource(SpectrogramAudioSource):
    """Filter & segment audio with voice activity detection."""

    def __init__(self, device, 
            gain, 
            low,
            high, 
            columns, 
            block_duration_ms,
            enable_spectrogram,
            aggressiveness):
        super().__init__(device, gain, low, high, columns, block_duration_ms, enable_spectrogram)
        self.vad = webrtcvad.Vad(aggressiveness)
        self.triggered = False
       
    def is_speech(self, numpy_block):
        #print(numpy_block)
        bytes_arr = np.chararray.tostring(numpy_block.astype(np.int16))
        #print(bytes_arr)
        is_speech = self.vad.is_speech(bytes_arr, 16000)
        return is_speech

    def vad_collector(self, padding_ms=600, ratio=0.75):
        """Generator that yields series of consecutive audio blocks comprising each utterence, separated by yielding a single None.
            Determines voice activity by ratio of blocks in padding_ms. Uses a buffer to include padding_ms prior to being triggered.
            Example: (block, ..., block, None, block, ..., block, None, ...)
                      |---utterence---|        |---utterence---|
        """
        
        num_padding_blocks = padding_ms // self.block_duration_ms
        ring_buffer = collections.deque(maxlen=num_padding_blocks)
        self.triggered = False

        #... note use of iter(self) - we expect this method to be called in a separete thread 
        for block in iter(self):
            is_speech = self.is_speech(block)
            #print((is_speech,triggered))
            if not self.triggered:
                ring_buffer.append((block, is_speech))
                num_voiced = len([f for f, speech in ring_buffer if speech])
                if num_voiced > ratio * ring_buffer.maxlen:
                    self.triggered = True
                    self.pending_response = True
                    print_output("Listening..")
                    for f, s in ring_buffer:
                        yield f
                    ring_buffer.clear()

            else:
                yield block
                ring_buffer.append((block, is_speech))
                num_unvoiced = len([f for f, speech in ring_buffer if not speech])
                if num_unvoiced > ratio * ring_buffer.maxlen:
                    self.triggered = False
                    yield None
                    ring_buffer.clear()


def audio_consumer(vad_audio, websocket, enable_spinner=True):
    """blocks"""
    if enable_spinner:
        spinner = Halo(spinner='line') # circleHalves point arc boxBounce2 bounce line

    length_ms = 0
    global websocket_ready
    for block in vad_audio.vad_collector():

        if block is not None:
            if not length_ms:
                logging.debug("begin utterence")
            if spinner: spinner.start()
            logging.log(5, "sending block")
            bytes_arr = np.chararray.tostring(block.astype(np.int16))
            if websocket_ready and websocket.is_active:
                websocket.send_binary(bytes_arr)
            length_ms += vad_audio.block_duration_ms

        else:
            if spinner: spinner.stop()
            if not length_ms: raise RuntimeError("ended utterence without beginning")
            logging.debug("end utterence")

            logging.info("sent audio length_ms: %d" % length_ms)
            logging.log(5, "sending EOS")
            if websocket_ready and websocket.is_active:
                websocket.send_text('EOS')
            length_ms = 0


websocket_ready = False
def websocket_runner(websocket, vad_audio):
    """blocks"""

    def on_event(event):
        if isinstance(event, events.Ready):
            global websocket_ready
            if not websocket_ready:
                print_output("Connected!")
            websocket_ready = True
        elif isinstance(event, events.Text):
            if 1: 
                print_output("Recognized: %s" % event.text)
                vad_audio.pending_response = False

        elif 1:
            print_output(event)
            vad_audio.pending_response = False
            logging.debug(event)

    for event in websocket:
        try:
            on_event(event)
        except:
            logger.exception('error handling %r', event)
            vad_audio.pending_response = False
            websocket.close()            

def main():


    def int_or_str(text):
        """Helper function for argument parsing."""
        try:
            return int(text)
        except ValueError:
            return text

    try:
        columns, _ = shutil.get_terminal_size()
    except AttributeError:
        columns = 80

    parser = argparse.ArgumentParser(description="Streams raw audio data from microphone with VAD to server via WebSocket")
    parser.add_argument('-b', '--block-duration', type=float,
                        metavar='DURATION', default=30,
                        help='block size (default %(default)s milliseconds)')
    parser.add_argument('-c', '--columns', type=int, default=columns,
                        help='width of spectrogram')
    parser.add_argument('-d', '--device', type=int_or_str,
                        help='input device (numeric ID or substring)')
    parser.add_argument('-g', '--gain', type=float, default=0.01,
                        help='initial gain factor (default %(default)s)')
    parser.add_argument('-r', '--range', type=float, nargs=2,
                        metavar=('LOW', 'HIGH'), default=[100, 2000],
                        help='frequency range (default %(default)s Hz)')
    parser.add_argument('-s', '--server', default='ws://asr.koreromaori.io/stt',
        help='Default: %(default)')
    parser.add_argument('--enable-spectrogram', action='store_true')
    parser.add_argument('-a', '--aggressiveness', type=int, default=3,
            help="Set aggressiveness of VAD: an integer between 0 and 3, 0 being the least aggressive about filtering out non-speech, 3 the most aggressive. Default: 3")

    ARGS = parser.parse_args()

    enable_spectrogram = ARGS.enable_spectrogram

    low, high = ARGS.range
    if high <= low:
        parser.error('HIGH must be greater than LOW')

    vad_audio = VADAudioSource(device=ARGS.device, 
        gain=ARGS.gain,
        low=low, high=high, 
        columns=ARGS.columns,
        enable_spectrogram=enable_spectrogram,
        aggressiveness=ARGS.aggressiveness,
        block_duration_ms=ARGS.block_duration)

    #print("Listening (ctrl-C to exit)...")
    websocket = WebSocket(ARGS.server)

    #vad_audio = VADAudio(aggressiveness=ARGS.aggressiveness)
    print_output("Enabling Voice Detection ...")
    audio_consumer_thread = threading.Thread(target=lambda: audio_consumer(vad_audio, websocket))
    audio_consumer_thread.start()

    print_output("Listening for audio...")
    audio_producer_thread = threading.Thread(target=lambda: vad_audio.listen())
    audio_producer_thread.start()

    print_output("(ctrl-C to exit)")
    print_output("")

    websocket_runner(websocket, vad_audio)

if __name__ == "__main__":
    main()