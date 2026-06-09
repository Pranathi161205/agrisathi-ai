# routes/chat.py

from fastapi import APIRouter
from pydantic import BaseModel

from services.groq_service import ask_agri_ai

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    question: str
    language: str = "English"

@router.post("/")
def chat(req: ChatRequest):

    answer = ask_agri_ai(req.question, req.language)

    return {
        "response": answer
    }