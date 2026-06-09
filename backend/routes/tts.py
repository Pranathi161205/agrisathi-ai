from fastapi import APIRouter
from pydantic import BaseModel
from gtts import gTTS
from fastapi.responses import StreamingResponse
from io import BytesIO

router = APIRouter(prefix="/tts")

class TTSRequest(BaseModel):
    text: str
    language: str = "te"

@router.post("/")
def generate_tts(request: TTSRequest):

    tts = gTTS(
        text=request.text,
        lang=request.language
    )

    audio_buffer = BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)

    return StreamingResponse(
        audio_buffer,
        media_type="audio/mpeg"
    )