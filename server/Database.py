from typing import Dict, Any
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os
MONGOURI = os.getenv("MONGOURI", "mongodb://localhost:27017/")
client = MongoClient(MONGOURI)
db = client["jobfit_ai"]
users_collection = db["users"]
def _now():
    return datetime.now()
def create_user_doc(name: str, email: str, password: str) -> str:
    """
    Create a user and return string user_id (ObjectId as str).
    """
    user_doc = {
        "name": name,
        "email": email,
        "password": password,  # TODO: Hash passwords in production
        "resume_data": {},
        "resume_file": None,
        "resume_filename": None,
        "target_role": "",
        "progress": {},
        "current_chat": [],
        "user_chats": [],
        "created_at": _now(),
        "last_updated": _now()
    }
    result = users_collection.insert_one(user_doc)
    return str(result.inserted_id)
def get_user_by_email(email: str) -> Dict[str, Any]:
    return users_collection.find_one({"email": email})
def get_user_by_id(user_id: str) -> Dict[str, Any]:
    return users_collection.find_one({"_id": ObjectId(user_id)})
def update_user_fields(user_id: str, updates: Dict[str, Any]):
    updates["last_updated"] = _now()
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates}, upsert=False)
def save_user_progress(user_id: str, resume_data: Dict, target_role: str, progress: Dict):
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "resume_data": resume_data,
                "target_role": target_role,
                "progress": progress,
                "last_updated": _now()
            }
        },
        upsert=True
    )
def get_user_progress(user_id: str) -> Dict:
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return user or {}
def save_resume_file(user_id: str, filename: str, file_data: bytes):
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"resume_file": file_data, "resume_filename": filename, "last_updated": _now()}},
        upsert=True
    )
def get_resume_file(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None, None
    return user.get("resume_file"), user.get("resume_filename")
def push_current_chat_message(user_id: str, user_msg: str, ai_msg: str):
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"current_chat": {"user": user_msg, "ai": ai_msg, "ts": _now()}}}
    )
def end_current_chat_session(user_id: str) -> int:
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return 0
    current_chat = user.get("current_chat", [])
    if not current_chat:
        return 0
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"user_chats": current_chat}, "$set": {"current_chat": []}, "$currentDate": {"last_updated": True}}
    )
    return len(current_chat)
def find_all_users_with_role():
    """
    Return cursor for users who have a target_role set (non-empty)
    """
    return users_collection.find({"target_role": {"$exists": True, "$ne": ""}})
