
import os
import json
import requests
import argparse

def readFileData(wav_file_path):
    with open(wav_file_path, mode='rb') as f:
        return f.read()

def transcribe(url, wav_file_path):
    
    wavData = readFileData(wav_file_path)
    with requests.post(url, data=wavData) as resp:
        if resp.status_code == 200:
            result = resp.json()
            #print(result)
            return result["transcription"]
        else:
            resp.raise_for_status()
            
def main(args):

    url = "https://{0}:{1}@asr.koreromaori.io/transcribe".format(
        args.user, args.password);
   
    result = transcribe(url, args.file)
    print(result)

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser()
    parser.add_argument('file', 
        help="Path to audio file to transcribe")
    parser.add_argument('-u', '--user', required=True, 
        help="Contact https://papareo.nz for an API user/password.")
    parser.add_argument('-p', '--password', required=True, 
        help="Contact https://papareo.nz for an API user/password.")
    args = parser.parse_args()
    
    main(args)
 