from pydantic import BaseModel
from typing import List, Optional

class Chat(BaseModel):
    chat_id: str
    members: List[str]
    is_ai_chat: bool

class Message(BaseModel):
    chat_id: str
    sender_id: str
    content: str
    created_at: str
