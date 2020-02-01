# DeepSpeech WebSocket Command Line Client 

This is a command line based [WebSocket](https://en.wikipedia.org/wiki/WebSocket) client for the server in this repo. Based on the work of  [@daanzu](https://github.com/sponsors/daanzu) 


## Features

* Client
    - Streams raw audio data from microphone to server via WebSocket
    - Voice activity detection (VAD) to ignore noise and segment microphone input into separate utterances
    - Hypnotizing spinner to indicate voice activity is detected!
    - Spectrogram view of audio when --enable-spectrogram is passed in

## Installation

This package is developed in Python 3.

Activate a virtualenv, then install the requirements.

```bash
pip install -r requirements.txt
```


The client uses `sounddevice` library for microphone access.  On Linux, you may need to install portaudio header files to compile the pyaudio package: `sudo apt install portaudio19-dev` . On windows use Anaconda.
On MacOS, try installing portaudio with brew: `brew install portaudio` .


## Usage

```
λ py client.py
Listening...
Recognized: alpha bravo charlie
Recognized: delta echo foxtrot
^C
```

```
λ py client.py -h
usage: client.py [-h] [-b DURATION] [-c COLUMNS] [-d DEVICE]
                 [-g GAIN] [-r LOW HIGH] [-s SERVER]
                 [--enable-spectrogram] [-a AGGRESSIVENESS]


Streams raw audio data from microphone with VAD to server via WebSocket

optional arguments:
  -h, --help            show this help message and exit
  -b DURATION, --block-duration DURATION
                        block size (default 30 milliseconds)
  -c COLUMNS, --columns COLUMNS
                        width of spectrogram
  -d DEVICE, --device DEVICE
                        input device (numeric ID or substring)
  -g GAIN, --gain GAIN  initial gain factor (default 0.01)
  -r LOW HIGH, --range LOW HIGH
                        frequency range (default [100, 2000] Hz)
  -s SERVER, --server SERVER
                        Default: ws://0.0.0.0:5000/stt
  --enable-spectrogram
  -a AGGRESSIVENESS, --aggressiveness AGGRESSIVENESS
                        Set aggressiveness of VAD: an integer between 0 and 3,
                        0 being the least aggressive about filtering out non-
                        speech, 3 the most aggressive. Default: 3
```

## Contributions


Contributors:
* [@Zeddy913](https://github.com/Zeddy913)
* [@Daanzu](https://github.com/daanzu)
* Tehiku Media
