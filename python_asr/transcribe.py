
import os
import json
import aiohttp
import aiofiles 
import asyncio
import argparse

async def readFileData(wav_file_path):
    async with aiofiles.open(wav_file_path, mode='rb') as f:
        return await f.read()

async def transcribe(http, url, wav_file_path):
    
    wavData = await readFileData(wav_file_path)
    async with http.post(url, data=wavData) as resp:
        if resp.status == 200:
            result = await resp.json()
            result["file"] = wav_file_path
            result["http_status"] = resp.status
        else:
            result = {
                "success": False,
                "file": wav_file_path,
                "http_status": resp.status,
                "err": resp
            }
        print(result)
        return result

            
async def main(args):

    url = "https://asr.koreromaori.io/transcribe";
   
    conn = aiohttp.TCPConnector(limit=20) 
    headers={"Authorization": f"Token {args.token}"}   
    http_session = aiohttp.ClientSession(
        connector=conn,
        headers=headers)
   
    # deprecated but supported
    if args.user:
        auth=aiohttp.BasicAuth(args.user, args.password)
        http_session.auth = auth

    async with http_session:
        
        tasks = (transcribe(http_session, url, wav_file)
                    for wav_file in args.files)

        await asyncio.gather(*tasks, return_exceptions=True)
       
        await http_session.close()

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser()
    parser.add_argument('files', nargs='*', 
        help="transcribe these files")
    parser.add_argument('-t', '--token', required=True, 
        help="Contact https://papareo.nz for an API token.")
    args = parser.parse_args()
    
    asyncio.run(main(args))
 