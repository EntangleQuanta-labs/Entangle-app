from fastapi import FastAPI
from app.api.workflows import router as workflows_router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(workflows_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Workflow Automation API!"}