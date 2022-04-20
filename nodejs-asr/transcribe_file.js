import { Buffer, Blob } from 'buffer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { auth_token } from './config.js'

const transcribeFile = async (filename) => {

    const formData = new FormData();
    formData.enctype = "multipart/form-data";
    //formData.append('audio_file', data, 'audio_file.mp3')        
    formData.append('audio_file', fs.createReadStream(filename));

    const url = 'https://asr.koreromaori.io/transcribe_file'
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Token ' + auth_token
        }
    };

    try {
        var response = await axios.post(url, formData, config);
        if (response.status==200 && response.data.success)
        {
            //console.log(response.data)
            return response.data.transcription;
        }
        else {
            msg = response.data.log;
            //console.error(msg)
            throw new Error('Problem transcribing file: ' + msg);
        }
    } catch (err) {
        if (err.response && err.response.status==401) {
            throw new Error("Authorization failure. Do you need to set the auth token (variable in transcribe.js)?");  
        }
        if (err.response && err.response.data && err.response.data.detail) {
            throw new Error("Error transcribing file: (" + err.response.status + ') ' + err.response.data.detail);
        }
        else {
            console.error(err);
            throw err;
        }
          
    }
}

// const readDataFromUrl = async (url, mimetype) => {
//     try {
//         var response = await axios.get(url,{
//             responseType: 'arraybuffer',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': mimetype,
//             }
//         });
//         if (response.status==200)
//         {
//             return response.data;
//         }
//     } catch (err) {
//         throw new Error('Error reading file');
//     }
// }

// using the test file in local dir  
//var data = readFileSync('test.mp3');

// Or if you want to access file from a url ..
// const url = 'xyz.com/2019/01/T%C5%ABranga.mp3';
// var data = await readDataFromUrl(url, 'audio/mp3');

var result = await transcribeFile('test.mp3');

// prints "tūranga tūranga"
console.log(result)