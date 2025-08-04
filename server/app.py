from flask import Flask, render_template, request, jsonify
import requests
import google.generativeai as genai
import json
from flask_jwt_extended import JWTManager, create_access_token
from pymongo import MongoClient

app = Flask(__name__)

# Replace with actual keys
GOOGLE_API_KEY = "your-google-api-key"
NEW_API_KEY = "your-adzuna-api-key"
NEW_API_ID = "your-adzuna-app-id"

# Google Generative AI config
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')  # Model name corrected

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")  # Adjust for your DB
db = client["jobfit_ai"]
collection = db["users"]

# JWT setup
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)

# Home Route
@app.route('/')
def home():
    p = job_listing("Frontend Developer")
    return jsonify(p)

# Prompt route (demo for async route)
@app.route('/therouter')
def read():
    prompt = "enter your query here"
    return f"The prompt is: {prompt}"

# Job listing function
def job_listing(keyword):
    search_term = "%20".join(keyword.split())
    url = f"http://api.adzuna.com/v1/api/jobs/in/search/1?app_id={NEW_API_ID}&app_key={NEW_API_KEY}&results_per_page=10&what={search_term}&content-type=application/json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch jobs"}

# Register user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if collection.find_one({"email": data["email"]}):
        return jsonify({"msg": "User already exists"}), 400
    collection.insert_one(data)
    return jsonify({"msg": "User created"}), 201

# Login user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = collection.find_one({"email": data["email"]})
    if user and user["password"] == data["password"]:  # Use hashing in real apps
        access_token = create_access_token(identity=user["email"])
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)
