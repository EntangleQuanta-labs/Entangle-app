from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llama import get_model_response


class WorkflowCreateRequest(BaseModel):
    request: str


router = APIRouter()

@router.get("/create")
def test():
    return {"message": "Hello World"}

@router.post("/create")
def create_workflow(request: WorkflowCreateRequest):
    print(request)
    response = get_model_response(prompt=request)
    print(response)
    return f'''{response}'''

     
