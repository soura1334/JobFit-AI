from typing import Dict
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["skill_gap_analyzer"]
users = db["users"]

def save_user_progress(user_id: str, resume_data: Dict, target_role: str, progress: Dict):
    users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "resume_data": resume_data,
                "target_role": target_role,
                "progress": progress,
                "last_updated": datetime.now()
            }
        },
        upsert=True
    )

def get_user_progress(user_id: str) -> Dict:
    return users.find_one({"user_id": user_id}) or {}