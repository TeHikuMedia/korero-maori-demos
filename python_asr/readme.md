### Example code for using Papa Reo API ASR features from python

### Setup

```
virtualenv env --python=python3
source env/bin/activate 
pip install -r requirements.txt
```

### Usage

This assumes you have the required username and password for the papareo api (uuuu and xxxx respetively in the below)

**Transcribe one file**

```
(env) > python [transcribe_one.py](transcribe_one.py) -u uuuu -p xxxx file.wav
```

```
ahakoa noa atu ka aroha hoki ahau ki a ia
```


**Transcribe a bunch of files (example of async code)**

```
(env) > python [transcribe.py](transcribe.py) -u uuuu -p xxxx *.wav
```

```json
{'success': True, 'transcription': 'he aha koe i kōrero wawe mai ki ahau', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 3.1s to transcribe 2.8s audio file /tmp/tmpyh99rc6e.wav'", 'file': '178.wav', 'http_status': 200}
{'success': True, 'transcription': 'heoi anō ko taua āhua rā anō', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 2.7s to transcribe 2.1s audio file /tmp/tmpkyg86s1i.wav'", 'file': '151.wav', 'http_status': 200}
{'success': True, 'transcription': 'koia rā te kaha o tana māia', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 3.3s to transcribe 2.9s audio file /tmp/tmplo2r2zya.wav'", 'file': '118.wav', 'http_status': 200}
{'success': True, 'transcription': 'e rongorongo atu ana koe i āna kōrero', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 3.5s to transcribe 3.2s audio file /tmp/tmpy0hssa3l.wav'", 'file': '187.wav', 'http_status': 200}
{'success': True, 'transcription': 'he momo nō tōna whānau', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 3.7s to transcribe 3.1s audio file /tmp/tmp088823jt.wav'", 'file': '117.wav', 'http_status': 200}
{'success': True, 'transcription': 'he aha te tūmomo mea nei', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 1.9s to transcribe 2.0s audio file /tmp/tmpm3w_ou8h.wav'", 'file': '225.wav', 'http_status': 200}
{'success': True, 'transcription': 'e mate ana au i te hiakai', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 2.6s to transcribe 2.9s audio file /tmp/tmphqmu4_kd.wav'", 'file': '172.wav', 'http_status': 200}
{'success': True, 'transcription': 'e mea ana koe māku e aha', 'model_version': '20201126_SC_0.9.1_thm', 'log': "Took 2.3s to transcribe 2.5s audio file /tmp/tmp0eubep47.wav'", 'file': '202.wav', 'http_status': 200}
```

### Documentation

[https://asr.koreromaori.io/docs](https://asr.koreromaori.io/docs
)

