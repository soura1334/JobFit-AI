from flask import Flask, render_template, request, jsonify
import requests
import google.generativeai as genai
import json
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os
import fitz

app = Flask(__name__)

# Replace with actual keys
GOOGLE_API_KEY = "your-google-api-key"
NEW_API_KEY = "your-adzuna-api-key"
NEW_API_ID = "your-adzuna-app-id"

# Google Generative AI config
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-pro")

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["jobfit_ai"]
collection = db["users"]

# JWT setup
app.config["JWT_SECRET_KEY"] = "your-secret-key"
jwt = JWTManager(app)


# Home Route
@app.route("/")
def home():
    p = job_listing("Frontend Developer")
    return jsonify(p)


# Prompt route (demo)
@app.route("/getJobs")
def read():
    prompt = "enter your query here"
    return f"The prompt is: {prompt}"

@app.route("/skills", methods=["GET"])
@jwt_required()
def skills():
    email = get_jwt_identity()
    user = collection.find_one({"email": email})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    job_role = user.get("job_role", "")
    resume_text = user.get("resume_text", "")

    if not job_role or not resume_text:
        return jsonify({"msg": "Missing job role or resume text in profile"}), 400

    # Fetch job listings for that role
    jobs_data = job_listing(job_role)
    jobs_json = json.dumps(jobs_data, indent=2)

    # Build the prompt with actual data
    prompt = f"""
You are an expert job-seeking advisor.

I want you to suggest a list of technical skills (like Python, React, SQL, etc.) that are essential for the jobs I am targeting but are missing from my resume.

Here is my resume text:
{resume_text}

Here are job descriptions for the role I want:
{jobs_json}

Return the response as a JSON list of strings like this:
["React", "JavaScript", "Redux"]
Only return the JSON list — no explanation.
"""

    try:
        response = model.generate_content(prompt)
        skills_suggestion = response.text.strip()

        # Use the generated skills to create roadmap
        roadmap_text = generate_roadmap(skills_suggestion)

        return jsonify({
            "skills": json.loads(skills_suggestion),  # safely parse JSON list
            "roadmap": roadmap_text
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"msg": "Failed to generate skills", "error": str(e)}), 500


def generate_roadmap(skills_list_json):
    prompt = f"""
You are an expert planner.

I want you to create a 30-day learning roadmap to efficiently acquire the following skills:
skills: {skills_list_json}

Give me a clear day-by-day plan in JSON format:
{{
  "Day 1": "Learn basics of Python",
  "Day 2": "Work on variables and data types in Python",
  ...
}}
Only return JSON.
"""
    try:
        response = model.generate_content(prompt)
        return json.loads(response.text.strip())

    except Exception as e:
        print("Error:", e)
        return {"error": "Failed to generate roadmap"}
    

@app.route("/updateProfile", methods=["POST"])
@jwt_required()
def update_profile():
    email = get_jwt_identity()
    user = collection.find_one({"email": email})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    job_role = request.form.get("job_role")
    if not job_role:
        return jsonify({"msg": "Job role is required"}), 400

    if "resume" not in request.files:
        return jsonify({"msg": "Resume file is missing"}), 400

    file = request.files["resume"]
    if file.filename == "" or not file.filename.endswith(".pdf"):
        return jsonify({"msg": "Valid PDF file is required"}), 400

    try:
        # ✅ Read PDF directly from memory
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

    except Exception as e:
        return jsonify({"msg": "Failed to extract text from PDF", "error": str(e)}), 500

    # ✅ Update MongoDB directly
    collection.update_one(
        {"email": email}, {"$set": {"resume_text": text, "job_role": job_role}}
    )

    return jsonify({"msg": "Profile updated with resume text and job role"}), 200


# Job listing function
def job_listing(keyword):
    search_term = "%20".join(keyword.split())
    url = f"http://api.adzuna.com/v1/api/jobs/in/search/1?app_id={NEW_API_ID}&app_key={NEW_API_KEY}&results_per_page=10&what={search_term}&content-type=application/json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch jobs"}


# ✅ REGISTER Route (with name, email, password, phone)
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if not all([name, email, password, phone]):
        return jsonify({"msg": "Missing fields"}), 400

    if collection.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    # NOTE: In production, hash the password using bcrypt or werkzeug.security
    user_data = {
        "name": name,
        "email": email,
        "password": password,
        "phone": phone,
        "resume": "",  # As you mentioned before, add empty resume field
    }

    collection.insert_one(user_data)

    access_token = create_access_token(identity=email)
    return jsonify({"msg": "User created", "token": access_token}), 201


# ✅ LOGIN Route (returning token)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = collection.find_one({"email": email})
    if user and user["password"] == password:
        access_token = create_access_token(identity=email)
        return jsonify({"msg": "Login successful", "token": access_token}), 200
    return jsonify({"msg": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True)
