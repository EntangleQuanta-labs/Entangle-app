from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.llama import get_model_response
import os

class WorkflowCreateRequest(BaseModel):
    request: str


router = APIRouter()

@router.post("/create")
def create_workflow(request: WorkflowCreateRequest):
    print(request)
    response = get_model_response(prompt=request)
    print(response)
    return response

     
