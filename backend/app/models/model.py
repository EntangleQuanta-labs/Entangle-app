from pydantic import BaseModel

class WorkflowCreateRequest(BaseModel):
    command: str
    