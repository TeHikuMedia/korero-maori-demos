
import os
import json
import requests
import argparse

def readFileData(wav_file_path):
    with open(wav_file_path, mode='rb') as f:
        return f.read()

def transcribe(wav_file_path, target_sentence, api_token):
    
    wavData = readFileData(wav_file_path)

    url = f"https://arero.koreromaori.io/compare_audio/?target_sentence={target_sentence}"
    headers = {"Authorization": f"Token {api_token}"}  
    with requests.post(url, headers=headers, data=wavData) as resp:
        if resp.status_code == 200:
            result = resp.json()
            return result
        else:
            resp.raise_for_status()
            
if __name__ == "__main__":
    
    parser = argparse.ArgumentParser()
    parser.add_argument('file', 
        help="Path to audio file to transcribe")
    parser.add_argument('-s', '--sentence', required=True, 
        help="Target sentence (in te reo Māori).")
    parser.add_argument('-t', '--token', required=True, 
        help="Contact https://papareo.nz for an API token.")
    args = parser.parse_args()
    
    result = transcribe(args.file, args.sentence, args.token)
    print(result)
