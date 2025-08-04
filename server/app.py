from flask import Flask, render_template
import requests
import google.generativeai as genai
import json
import os
app = Flask(__name__)
GOOGLE_API_KEY=""
genai.configure(api_key=GOOGLE_API_KEY)
model=genai.GenerativeModel('gemini 2.5 pro')
NEW_API_KEY=""
NEW_API_"
@app.route('/')
def home():
    p=job_listing("Frontend Devloper")
    return p
@app.route('/THEROUTER') 
async def read():
    prompt="enter your query here"
    return "the prompt is{prompt}"
def job_listing(a):
    k=a.split()
    newstring=""
    for word in k:
        newstring+=(word+"%20")
    y= requests.get(f"http://api.adzuna.com/v1/api/jobs/in/search/1?app_id={NEW_API_ID}&app_key={NEW_API_KEY}&results_per_page=10&what={newstring}&content-type=application/json")
    return json.dumps(y)

if __name__ == '__main__':
    app.run(debug=True)

