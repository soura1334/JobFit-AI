import os
import re
import json
import tempfile
import requests
import smtplib
from typing import List, Dict, Optional, Any
from email.mime.text import MIMEText
from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from apscheduler.schedulers.background import BackgroundScheduler
from pydantic import BaseModel
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
import fitz
import docx
import google.generativeai as genai

# local Database helpers
from Database import (
    create_user_doc, get_user_by_email, get_user_by_id, update_user_fields,
    save_user_progress, get_user_progress, save_resume_file, get_resume_file,
    push_current_chat_message, end_current_chat_session, find_all_users_with_role
)

#Environment & Configuration
load_dotenv()
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
GOOGLE_API_KEY = os.getenv("GEMINI_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretjwt")
MONGO_URI = os.getenv("MONGOURI", "mongodb://localhost:27017/")

# Gemini setup
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# Sentence transformer for embeddings & similarity
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

# Master skills list
MASTER_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Angular", "Vue",
    "Node.js", "Django", "Flask", "SQL", "MySQL", "PostgreSQL", "MongoDB",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux",
    "Power BI", "Tableau", "Excel", "Machine Learning", "Deep Learning",
    "TensorFlow", "PyTorch", "Pandas", "NumPy", "Data Analysis",
    "HTML", "CSS", "Bootstrap", "Git", "REST API", "FastAPI"
]

# Flask setup
app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#Pydantic Models
class RoleInput(BaseModel):
    role: str
class SkillsInput(BaseModel):
    user_skills: List[str]
    role: str
class MissingSkill(BaseModel):
    skill: str
    priority: float
class Resource(BaseModel):
    title: str
    platform: str
    url: str
    free: bool
class RoadmapItems(BaseModel):
    day: int
    skill: str
    tasks: List[str]
    resources: List[Resource]
    hours: int
class RecommendationsResponse(BaseModel):
    roadmap: List[RoadmapItems]
class ResumeData(BaseModel):
    skills: List[str]
    education: List[Dict[str, Optional[str]]]
    experience: List[Dict[str, Optional[str]]]
    projects: List[Dict[str, Optional[str]]]

#Resume Parsing Helpers
def extract_text_from_pdf_bytes(file_data: bytes) -> str:
    doc = fitz.open(stream=file_data, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text
def extract_text_from_docx_bytes(file_data: bytes) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp:
        temp.write(file_data)
        temp.flush()
        doc = docx.Document(temp.name)
        text = "\n".join([para.text for para in doc.paragraphs])
    try:
        os.remove(temp.name)
    except Exception:
        pass
    return text
def extract_resume_data_with_gemini(text: str) -> Dict:
    """
    Use Gemini to extract structured resume data.
    Falls back to empty structure on parse failure.
    """
    prompt = (
        "You are JobFit-AI, a world-class HR analyst & NLP System."
        "Extract all relevant structured information like skills, education, experience, projects & many more information of relevance from this resume. "
        "Return the result strictly in structured JSON format with fields: "
        "skills (Technical and soft skills with synonyms normalized), "
        "For dates, return { start: YYYY-MM, end: YYYY-MM or Present }."
        "education (list of dicts with degree, specialization, institution, year), "
        "experience (list of dicts with role, company, duration, key responsibilities), "
        "projects (list of dicts with project title, tech stack & outcome). "
        "Only return valid JSON (no explanation). "
        "Resume:\n" + text
    )
    try:
        response = gemini_model.generate_content(prompt)
        raw = response.text.strip()
        if raw.startswith("```json"):
            raw = raw[len("```json"):].strip()
        if raw.endswith("```"):
            raw = raw[:-3].strip()
        data = json.loads(raw)
        return data
    except Exception:
        skills = []
        lower = text.lower()
        for s in MASTER_SKILLS:
            if re.search(rf"\b{re.escape(s.lower())}\b", lower):
                skills.append(s)
        return {"skills": skills, "education": [], "experience": [], "projects": []}
def extract_resume_skills_gemini(resume_text: str) -> List[str]:
    prompt = (
        "Extract a list of technical skills (like Python, React, SQL, etc.) from the following resume text. "
        "Return the response as a JSON list of strings only."
        "\n\nResume:\n" + resume_text
    )
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[len("```json"):].strip()
        if text.endswith("```"):
            text = text[:-3].strip()
        skills = json.loads(text)
        return skills if isinstance(skills, list) else []
    except Exception:
        found = []
        lower = resume_text.lower()
        for s in MASTER_SKILLS:
            if re.search(rf"\b{re.escape(s.lower())}\b", lower):
                found.append(s)
        return found

#Job Skills Fetcher (Adzuna)
def fetch_job_skills(role: str) -> List[str]:
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return []
    search_term = "%20".join(role.split())
    url = (
        f"https://api.adzuna.com/v1/api/jobs/in/search/1"
        f"?app_id={ADZUNA_APP_ID}&app_key={ADZUNA_APP_KEY}&results_per_page=10&what={search_term}&content-type=application/json"
    )
    try:
        response = requests.get(url, timeout=10)
        job_data = response.json()
    except Exception:
        return []
    job_descriptions = [job.get('description', '') for job in job_data.get("results", [])]
    combined_text = " ".join(job_descriptions).lower()
    extracted_skills = set()
    for skill in MASTER_SKILLS:
        if re.search(rf"\b{re.escape(skill.lower())}\b", combined_text):
            extracted_skills.add(skill)
    return list(extracted_skills)

#Skill Analyzer
def analyze_missing_skills(user_skills: List[str], job_skills: List[str]) -> List[Dict]:
    if not user_skills or not job_skills:
        return []
    try:
        user_embeddings = sentence_model.encode(user_skills, convert_to_tensor=True)
        job_embeddings = sentence_model.encode(job_skills, convert_to_tensor=True)
        similarity_matrix = util.cos_sim(user_embeddings, job_embeddings)
        missing_skills = []
        for j, job_skill in enumerate(job_skills):
            max_similarity = similarity_matrix[:, j].max().item()
            if max_similarity < 0.7:
                missing_skills.append({"skill": job_skill, "priority": round(1 - max_similarity, 2)})
        return missing_skills
    except Exception:
        lower_user = set([s.lower() for s in user_skills])
        missing = []
        for s in job_skills:
            if s.lower() not in lower_user:
                missing.append({"skill": s, "priority": 0.8})
        return missing

#Resources Loader & Roadmap Generator
def load_resources() -> Dict:
    try:
        with open("resources.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}
def analyze_skill_gap(user_skills: list, target_role: str) -> dict:
    prompt = f"""
    You are JobFit-AI, the most advanced career strategist.
    Your task: Compare the user's skills with the **target role** requirements.
    Inputs:
    - Target Role: "{target_role}"
    - User Skills: {user_skills}
    Steps:
    1. Retrieve or infer the industry-standard skillset for the target role.
    2. Compare user's skills vs. required skills.
    3. Identify exact gaps, labeling them as HIGH / MEDIUM / LOW priority.
    4. Recommend resources for each missing skill (e.g., free courses, docs, GitHub repos).
    5. Suggest 1-2 mini-projects to cover the gap.
    Output Format:
    {{
        "role_standard_skills": [],
        "user_current_skills": [],
        "gaps": [],
        "recommended_projects": []
    }}
    """
    response = gemini_model.generate_content(prompt)
    return json.loads(response.text)
def generate_roadmap(missing_skills: List[Dict]) -> Dict:
    skills_list = [ms["skill"] for ms in missing_skills]
    resources_db = load_resources()
    prompt = f"""
You are JobFit-AI, a top-tier career roadmap planner. Create a 30-day learning roadmap that transforms the user's current skills into the target role profile by efficiently acquiring these skills:
{json.dumps(skills_list)}
Incorporate resources from this database where applicable:
{json.dumps(resources_db, indent=2)}
Constraints:
- Break roadmap into 30/60/90 day phases.
- Each phase should include:
    - Skills to learn (with subtopics)
    - Resources (free + paid, include URLs if possible)
    - Weekly mini-projects
- Final milestone: Capstone Project demonstrating readiness for the role.
- Format in Markdown tables for readability.
Output Example:
Phase : Day 1-30
| Week |  Focus Skill  |            Resources          |     Mini-Project      |
|------|---------------|-------------------------------|-----------------------|
|   1  | Python for DS | "Python DS Handbook"          | Data cleaning project |
|   2  |     SQL       | "Mode Analytics SQL Tutorial" | Query Kaggle dataset  |
Return ONLY valid JSON in this exact shape:
[
    {{
    "Day": 1,
    "skill": "SkillName",
    "Topic": "Short topic/title",
    "Resources": [ {{ "title": "...", "platform":"...", "url":"...", "free": true }} ],
    "Notes": "short note"
    }},
    ...
]
Do not include any markdown or commentary.
"""
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[len("```json"):].strip()
        if text.endswith("```"):
            text = text[:-3].strip()
        roadmap_raw = json.loads(text)
        roadmap = []
        for item in roadmap_raw:
            day = item.get("Day", item.get("day", None)) or item.get("Day", 0)
            skill = item.get("skill", "")
            topic = item.get("Topic", "")
            resources = item.get("Resources", [])
            roadmap.append({
                "day": int(day),
                "skill": skill,
                "tasks": [topic] if topic else [],
                "resources": resources,
                "hours": 2
            })
        return {"roadmap": roadmap}
    except Exception:
        roadmap = []
        day = 1
        for s in skills_list:
            for d in range(3):
                roadmap.append({"day": day, "skill": s, "tasks": [f"Learn basics of {s}"], "resources": resources_db.get(s, []), "hours": 2})
                day += 1
        return {"roadmap": roadmap}

# Email / Notification Helpers
def send_email(subject: str, body: str, to_email: str):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("[WARN] Email credentials not set; skipping email send.")
        return
    msg = MIMEText(body, 'html')
    msg['Subject'] = subject
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"[ERROR] Failed to send email to {to_email}: {e}")
def daily_job_check():
    """
    Iterate users who have a target_role and email them a short summary if needed.
    """
    for user in find_all_users_with_role():
        try:
            user_id = str(user["_id"])
            resume_data = user.get("resume_data", {})
            if not resume_data:
                continue
            role = user.get("target_role", "")
            if not role:
                continue
            user_skills = resume_data.get("skills", [])
            job_skills = fetch_job_skills(role)
            missing_skills = analyze_missing_skills(user_skills, job_skills)
            if not missing_skills:
                continue
            email_body = "<h2>Daily Job Matches & Skill Gaps</h2>"
            email_body += f"<p>Target Role: {role}</p>"
            email_body += "<h3>Missing Skills:</h3><ul>"
            for ms in missing_skills:
                email_body += f"<li>{ms['skill']} (priority: {ms.get('priority')})</li>"
            email_body += "</ul>"
            send_email("Daily Job Matches & Skill Gaps", email_body, user.get("email"))
        except Exception as e:
            print("[ERROR] daily_job_check for user failed:", e)
def send_skill_gap_email_weekly():
    """
    Weekly job — re-analyze resumes uploaded and send weekly skill gap reports.
    """
    cursor = find_all_users_with_role()
    for user in cursor:
        try:
            user_id = str(user["_id"])
            file_data, filename = get_resume_file(user_id)
            if not file_data:
                continue
            if filename and filename.lower().endswith(".pdf"):
                text = extract_text_from_pdf_bytes(file_data)
            elif filename and filename.lower().endswith((".doc", ".docx")):
                text = extract_text_from_docx_bytes(file_data)
            else:
                continue
            resume_data = extract_resume_data_with_gemini(text)
            resume_skills = resume_data.get("skills", [])
            target_role = user.get("target_role", "")
            job_skills = fetch_job_skills(target_role)
            missing_skills = analyze_missing_skills(resume_skills, job_skills)
            if missing_skills:
                body = f"""
                <h2>Weekly Skill Gap Report</h2>
                <p>Target Role: {target_role}</p>
                <p>You need to improve on:</p>
                <ul>
                {''.join(f"<li>{s['skill']}</li>" for s in missing_skills)}
                </ul>
                """
                send_email("Weekly Skill Gap Report", body, user.get("email"))
        except Exception as e:
            print("[ERROR] send_skill_gap_email_weekly failed for user:", e)

# Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(daily_job_check, 'cron', hour='0', minute='30')
scheduler.add_job(send_skill_gap_email_weekly, 'cron', day_of_week='sun', hour='1', minute='0')
scheduler.start()

# Flask Routes
@app.route('/')
def home():
    return jsonify({"message": "Skill Gap Analyzer / JobFit-AI backend running."})
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not all([name, email, password]):
        return jsonify({"msg": "Missing fields"}), 400
    if get_user_by_email(email):
        return jsonify({"msg": "User already exists"}), 400
    user_id = create_user_doc(name, email, password)
    access_token = create_access_token(identity=user_id)
    user_response = {"name": name, "email": email}
    return jsonify({"msg": "User created", "token": access_token, "user": user_response, "user_id": user_id}), 201
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = get_user_by_email(email)
    if user and user["password"] == password:
        user_id = str(user["_id"])
        user_response = {"name": user["name"], "email": user["email"]}
        access_token = create_access_token(identity=user_id)
        return jsonify({"msg": "Login successful", "token": access_token, "user": user_response}), 200
    return jsonify({"msg": "Invalid credentials"}), 401
@app.route('/updateProfile', methods=['POST'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = get_user_progress(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    updates = {}
    job_role = request.form.get("targetRole") or request.json.get("targetRole") if request.is_json else request.form.get("targetRole")
    if job_role:
        updates["target_role"] = job_role
    if "resume" in request.files:
        file = request.files["resume"]
        filename = secure_filename(file.filename).lower()
        if filename == "" or not filename.endswith((".pdf", ".doc", ".docx")):
            return jsonify({"msg": "Valid resume file required (PDF, DOC, or DOCX)"}), 400
        try:
            file_data = file.read()
            if filename.endswith(".pdf"):
                text = extract_text_from_pdf_bytes(file_data)
            else:
                text = extract_text_from_docx_bytes(file_data)
            resume_data = extract_resume_data_with_gemini(text)
            updates["resume_data"] = resume_data
            updates["resume_file"] = file_data
            updates["resume_filename"] = filename
        except Exception as e:
            return jsonify({"msg": "Failed to process resume", "error": str(e)}), 500
    if not updates:
        return jsonify({"msg": "No data provided for update"}), 400
    update_user_fields(user_id, updates)
    return jsonify({"msg": "Profile updated successfully", "updated_fields": list(updates.keys())}), 200
@app.route('/upload-resume', methods=['POST'])
@jwt_required()
def upload_resume():
    user_id = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename).lower()
    if filename == "" or not filename.endswith((".pdf", ".doc", ".docx")):
        return jsonify({"error": "Valid resume file required (PDF, DOC, or DOCX)"}), 400
    file_data = file.read()
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf_bytes(file_data)
    else:
        text = extract_text_from_docx_bytes(file_data)
    resume_data = extract_resume_data_with_gemini(text)
    save_resume_file(user_id, filename, file_data)
    save_user_progress(user_id=user_id, resume_data=resume_data, target_role=get_user_progress(user_id).get("target_role", ""), progress={})
    return jsonify({"status": "Resume saved", "extracted_skills": resume_data.get("skills", [])})
@app.route('/skills', methods=['GET', 'POST'])
@jwt_required()
def skills():
    user_id = get_jwt_identity()
    user = get_user_progress(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    job_role = user.get("target_role", "")
    resume_data = user.get("resume_data", {})
    if not job_role or not resume_data:
        return jsonify({"msg": "Missing job role or resume data in profile"}), 400
    resume_skills = resume_data.get("skills", [])
    job_skills = fetch_job_skills(job_role)
    missing_skills = analyze_missing_skills(resume_skills, job_skills)
    roadmap = generate_roadmap(missing_skills)
    return jsonify({"skills": [ms["skill"] for ms in missing_skills], "roadmap": roadmap["roadmap"]}), 200
@app.route('/select-role', methods=['POST'])
@jwt_required()
def select_role():
    user_id = get_jwt_identity()
    try:
        payload = request.get_json()
        role_input = RoleInput(**payload)
    except Exception as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    current_resume = get_user_progress(user_id).get("resume_data", {})
    save_user_progress(user_id=user_id, resume_data=current_resume, target_role=role_input.role, progress={})
    return jsonify({"role": role_input.role, "status": "confirmed"})
@app.route('/analyze-skills', methods=['POST'])
@jwt_required()
def analyze_skills():
    try:
        payload = request.get_json()
        skills_input = SkillsInput(**payload)
    except Exception as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    job_skills = fetch_job_skills(skills_input.role)
    missing_skills = analyze_missing_skills(skills_input.user_skills, job_skills)
    return jsonify({"missing_skills": missing_skills})
@app.route('/recommendations', methods=['POST'])
@jwt_required()
def recommendations():
    try:
        missing_skills_input = [MissingSkill(**ms) for ms in request.get_json().get("missing_skills", [])]
    except Exception as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    roadmap = generate_roadmap([ms.dict() for ms in missing_skills_input])
    return jsonify(roadmap)
@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    user_id = get_jwt_identity()
    user = get_user_progress(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user_message = request.json.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "Empty message"}), 400
    context = f"""
You are JobFit-AI, a professional yet friendly career mentor and strategist.
You always provide responses that are:
- Personalized (based on the user's target role, skills, and experience)
- Motivating (supportive, encouraging tone)
- Actionable (recommend concrete steps, resources, and projects)
- Adaptive (if the user asks vague questions, guide them with clarifying questions first)
User profile:
- Target role: {user.get('target_role', 'Not set')}
- Skills: {', '.join(user.get('resume_data', {}).get('skills', []))}
- Experience: {user.get('resume_data', {}).get('experience', [])}
### Example Conversation Style:
User: "What jobs suit me?"
Assistant: "Since you know Python and SQL, you're already a great fit for roles like Data Analyst or Junior ML Engineer. To move toward Data Scientist, you'd need to upskill in TensorFlow and cloud tools like AWS. Would you like a roadmap for that?"
our Output:
- Always speak conversationally but with authority.
- Avoid vague filler phrases like "It depends."
- Suggest next steps at the end of every answer.
"""
    prompt = f"{context}\nUser: {user_message}\nAssistant:"
    try:
        response = gemini_model.generate_content(prompt)
        ai_reply = response.text.strip()
    except Exception as e:
        return jsonify({"error": "Gemini failed", "details": str(e)}), 500
    push_current_chat_message(user_id, user_message, ai_reply)
    return jsonify({"reply": ai_reply})
@app.route('/end-chat', methods=['POST'])
@jwt_required()
def end_chat():
    user_id = get_jwt_identity()
    count = end_current_chat_session(user_id)
    if count == 0:
        return jsonify({"msg": "No active chat"}), 400
    return jsonify({"msg": "Chat saved to history", "saved_messages": count}), 200

# Graceful shutdown of scheduler on exit
import atexit
atexit.register(lambda: scheduler.shutdown(wait=False))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)
