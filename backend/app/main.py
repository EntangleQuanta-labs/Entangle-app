from fastapi import FastAPI
from app.api.workflows import router as workflows_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(workflows_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Workflow Automation API!"}