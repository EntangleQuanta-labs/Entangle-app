from pydantic import BaseModel

class WorkflowCreateRequest(BaseModel):
    command: str

class WorkflowStatusResponse(BaseModel):
    workflow_id: str
    status: str