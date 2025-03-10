from fastapi import APIRouter, HTTPException, Depends 
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime
from typing import List
from app.services.llama import get_model_response
from database.mongo import chats_collection

# Define the models
class Message(BaseModel):
    chat_id: str
    sender_id: str
    content: str
    
class ChatResponse(BaseModel):
    chat_id: str
    messages: List[dict]

class WorkflowCreateRequest(BaseModel):
    request: str

router = APIRouter()

# Helper function to get a chat by ID
def get_chat_by_id(chat_id: str):
    chat = chats_collection.find_one({"_id": chat_id})
    return chat

# Get a chat by ID (for retrieval purposes)
@router.get("/chat/{chat_id}", response_model=ChatResponse)
def get_chat_by_id_route(chat_id: str):
    chat = get_chat_by_id(chat_id)
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return {"chat_id": chat_id, "messages": chat["messages"]}

# Route for testing purposes (checking AI model response)
@router.post("/test")
def test(request: WorkflowCreateRequest):
    print(request)
    response = get_model_response(prompt=request)
    return response

# Create or update chat and send/receive messages
@router.post("/chat")
def create_workflow(message: Message ,):
    chat = get_chat_by_id(message.chat_id)

    # If chat doesn't exist, create a new one
    if not chat:
        chat = {
            "_id": message.chat_id,
            "messages": []
        }
        chats_collection.insert_one(chat)
    
    # Save user message in the chat
    message_data = {
        "sender_id": message.sender_id,
        "content": message.content,
        "created_at": datetime.utcnow()
    }
    chats_collection.update_one(
        {"_id": message.chat_id},
        {"$push": {"messages": message_data}}
    )

    # Get the AI response using the `get_model_response` function
    ai_response = get_model_response(prompt={"request": message.content})
    
    # Save AI response in the same chat
    ai_message_data = {
        "sender_id": "ai",
        "content": ai_response,
        "created_at": datetime.utcnow()
    }
    chats_collection.update_one(
        {"_id": message.chat_id},
        {"$push": {"messages": ai_message_data}}
    )
    
    return {"message": "User message and AI response saved", "chat_id": message.chat_id}
