### Example code for using Papa Reo API ASR features from python

### Setup

```
virtualenv env --python=python3
source env/bin/activate 
pip install -r requirements.txt
```

### Usage

This assumes you have an API Token for the asr end point (xyz below)

**Fit a sentence**

```
(env) > python [arero.py](arero.py)  -t API_TOKEN -s 'hara mai te ātaahua o ngā kōtiro o tēnā hapū' 238.wav
```

```json
{'success': True, 'target_sentence': 'hara mai te ātaahua o ngā kōtiro o tēnā hapū', 'model_version': '20210202_2938_0.9.1_tflite', 'metadata': [{'char': 'h', 'start_time': 0.52, 'prob': 0.9714320302009583}, {'char': 'a', 'start_time': 0.54, 'prob': 0.5122475028038025}, {'char': 'r', 'start_time': 0.68, 'prob': 0.9807784557342529}, {'char': 'a', 'start_time': 0.7, 'prob': 0.9126426577568054}, {'char': ' ', 'start_time': 0.92, 'prob': 0.41982218623161316}, {'char': 'm', 'start_time': 0.98, 'prob': 0.9993545413017273}, {'char': 'a', 'start_time': 1.0, 'prob': 0.9987175464630127}, {'char': 'i', 'start_time': 1.06, 'prob': 0.999007523059845}, {'char': ' ', 'start_time': 1.22, 'prob': 0.9878739714622498}, {'char': 't', 'start_time': 1.26, 'prob': 0.999077320098877}, {'char': 'e', 'start_time': 1.28, 'prob': 0.9990623593330383}, {'char': ' ', 'start_time': 1.36, 'prob': 0.7554648518562317}, {'char': 'ā', 'start_time': 1.42, 'prob': 0.7445785403251648}, {'char': 't', 'start_time': 1.72, 'prob': 0.9993256330490112}, {'char': 'a', 'start_time': 1.74, 'prob': 0.869096040725708}, {'char': 'a', 'start_time': 2.04, 'prob': 0.6735815405845642}, {'char': 'h', 'start_time': 2.08, 'prob': 0.6614691615104675}, {'char': 'u', 'start_time': 2.12, 'prob': 0.999902606010437}, {'char': 'a', 'start_time': 2.18, 'prob': 0.9984256029129028}, {'char': ' ', 'start_time': 2.26, 'prob': 0.4751538932323456}, {'char': 'o', 'start_time': 2.34, 'prob': 0.9992315769195557}, {'char': ' ', 'start_time': 2.44, 'prob': 0.9397258758544922}, {'char': 'n', 'start_time': 2.5, 'prob': 0.9998419284820557}, {'char': 'g', 'start_time': 2.5, 'prob': 0.9998419284820557}, {'char': 'ā', 'start_time': 2.52, 'prob': 0.978402853012085}, {'char': ' ', 'start_time': 2.72, 'prob': 0.5222335457801819}, {'char': 'k', 'start_time': 2.78, 'prob': 0.9973121881484985}, {'char': 'ō', 'start_time': 2.8, 'prob': 0.9417827725410461}, {'char': 't', 'start_time': 3.02, 'prob': 0.999975323677063}, {'char': 'i', 'start_time': 3.04, 'prob': 0.9999450445175171}, {'char': 'r', 'start_time': 3.14, 'prob': 0.9993492960929871}, {'char': 'o', 'start_time': 3.16, 'prob': 0.9998928308486938}, {'char': ' ', 'start_time': 3.24, 'prob': 0.361113041639328}, {'char': 'o', 'start_time': 3.3, 'prob': 0.3640349209308624}, {'char': ' ', 'start_time': 3.42, 'prob': 0.5039742588996887}, {'char': 't', 'start_time': 3.5, 'prob': 0.9995272159576416}, {'char': 'ē', 'start_time': 3.52, 'prob': 0.9996445178985596}, {'char': 'n', 'start_time': 3.78, 'prob': 0.9997921586036682}, {'char': 'ā', 'start_time': 3.8, 'prob': 0.998808741569519}, {'char': ' ', 'start_time': 4.0, 'prob': 0.9362905621528625}, {'char': 'h', 'start_time': 4.06, 'prob': 0.9955917000770569}, {'char': 'a', 'start_time': 4.08, 'prob': 0.9884008169174194}, {'char': 'p', 'start_time': 4.24, 'prob': 0.9940767288208008}, {'char': 'ū', 'start_time': 4.26, 'prob': 0.9805020689964294}], 'log': 'Took 0.7s to fit audio to target'}
```


### Documentation

[https://arero.koreromaori.io/docs](https://arero.koreromaori.io/docs
)

