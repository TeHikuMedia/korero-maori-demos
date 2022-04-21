import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { auth_token } from './config.js'

const transcribeFile = async (filename) => {

    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(filename));
    const url = 'https://asr.koreromaori.io/transcribe_file'
    const config = {
        headers: {
            'Authorization': 'Token ' + auth_token,
            ...formData.getHeaders(),
        }
    };

    try {
        const response = await axios.post(url, formData, config);
        if (response.status === 200 && response.data.success) {
            return response.data.transcription;
        }
        else {
            throw new Error(`Problem transcribing file:${response.data.log} ` + msg);
        }
    } catch (err) {
        if (err?.response?.status === 401) {
            throw new Error("Authorization failure. Do you need to set the auth token (variable in transcribe.js)?");  
        }
        if (err?.response?.data?.detail) {
            throw new Error(`Error transcribing file: (${err.response.status}) ${err.response.data.detail}`, err);
        }
        else {
            console.error(err);
            throw err;
        }
          
    }
}

var result = await transcribeFile('test.mp3');

// prints "tūranga tūranga"
console.log(result)