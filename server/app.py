from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
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
from dotenv import load_dotenv
from bson import ObjectId
from werkzeug.utils import secure_filename
import os
from datetime import timedelta
import fitz

load_dotenv()

app = Flask(__name__)
CORS(app)

# Replace with actual keys
GOOGLE_API_KEY = os.getenv("GEMINI_KEY")
NEW_API_KEY = os.getenv("ADZUNA_KEY")
NEW_API_ID = os.getenv("ADZUNA_ID")

# Google Generative AI config
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# MongoDB setup
client = MongoClient(os.getenv("MONGOURI"))
db = client["jobfit_ai"]
collection = db["users"]

# JWT setup
app.config["JWT_SECRET_KEY"] = "your-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)  # ✅ 7-day expiry
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

@app.route("/skills", methods=["POST"])
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

    jobs_data = job_listing(job_role)
    jobs_json = json.dumps(jobs_data, indent=2)

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
        skills_text = response.text.strip()

        print("Gemini raw output:", skills_text)

        # ✅ Strip markdown code block formatting if present
        if skills_text.startswith("```json"):
            skills_text = skills_text.removeprefix("```json").strip()
        if skills_text.endswith("```"):
            skills_text = skills_text.removesuffix("```").strip()

        try:
            skills_list = json.loads(skills_text)
        except json.JSONDecodeError as e:
            print("JSON decode error:", e)
            return jsonify({"msg": "Invalid response from Gemini", "raw": skills_text}), 500

        roadmap = generate_roadmap(skills_list)

        return jsonify({
            "skills": skills_list,
            "roadmap": roadmap
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"msg": "Failed to generate skills", "error": str(e)}), 500



def generate_roadmap(skills_list):
    prompt = f"""
You are an expert planner.

I want you to create a 30-day learning roadmap to efficiently acquire the following skills:
skills: {skills_list}

Give me a clear day-by-day plan in JSON format like this:
[
  {{"Day": 1, "Topic": "Learn basics of Python", "Resource": "https://youtube.com/@abc/python", "Notes": "Start with syntax and variables"}},
  {{"Day": 2, "Topic": "Work on variables and data types in Python", "Resource": "https://youtube.com/@abc/python", "Notes": "Focus on numbers, strings, lists"}}
  ...
]
Only return valid JSON. Do not include markdown (no ```json).
"""

    try:
        response = model.generate_content(prompt)
        roadmap_text = response.text.strip()

        # Remove Markdown code blocks if present
        if roadmap_text.startswith("```"):
            roadmap_text = roadmap_text.split("```")[1].strip()

        return json.loads(roadmap_text)

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

    updates = {}

    # ✅ Log incoming data for debugging
    print("Form keys:", list(request.form.keys()))
    print("File keys:", list(request.files.keys()))

    # ✅ Extract role
    job_role = request.form.get("targetRole")
    if job_role:
        updates["job_role"] = job_role

    # ✅ Handle resume upload (PDF, DOC, DOCX)
    if "resume" in request.files:
        file = request.files["resume"]
        filename = file.filename.lower()

        if filename == "" or not (filename.endswith(".pdf") or filename.endswith(".doc") or filename.endswith(".docx")):
            return jsonify({"msg": "Valid resume file required (PDF, DOC, or DOCX)"}), 400

        try:
            if filename.endswith(".pdf"):
                import fitz  # PyMuPDF
                pdf_bytes = file.read()
                doc = fitz.open(stream=pdf_bytes, filetype="pdf")
                text = ""
                for page in doc:
                    text += page.get_text()
                doc.close()
                updates["resume_text"] = text
            else:
                # For .doc/.docx files
                from docx import Document
                import tempfile
                with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp:
                    temp.write(file.read())
                    temp.flush()
                    doc = Document(temp.name)
                    text = "\n".join([para.text for para in doc.paragraphs])
                    updates["resume_text"] = text

        except Exception as e:
            return jsonify({"msg": "Failed to extract text from resume", "error": str(e)}), 500

    if not updates:
        return jsonify({"msg": "No data provided for update"}), 400

    collection.update_one({"email": email}, {"$set": updates})
    return jsonify({
        "msg": "Profile updated successfully",
        "updated_fields": list(updates.keys())
    }), 200



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

    if not all([name, email, password]):
        return jsonify({"msg": "Missing fields"}), 400

    if collection.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    # NOTE: In production, hash the password using bcrypt or werkzeug.security
    user_data = {
        "name": name,
        "email": email,
        "password": password,
        "resume": "",  # As you mentioned before, add empty resume field
    }

    result = collection.insert_one(user_data)
    user_response = {
    "name": name,
    "email": email
}

    access_token = create_access_token(identity=email)
    return jsonify({"msg": "User created", "token": access_token, "user": user_response}), 201


# ✅ LOGIN Route (returning token)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = collection.find_one({"email": email})
    if user and user["password"] == password:
        user_response = {
    "name": user["name"],
    "email": user["email"]
}
        access_token = create_access_token(identity=email)
        return jsonify({"msg": "Login successful", "token": access_token, "user":user_response}), 200
    return jsonify({"msg": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True)
