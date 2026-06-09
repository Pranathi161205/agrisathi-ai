from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tts import router as tts_router
from routes.chat import router as chat_router
from routes.weather import router as weather_router
from routes.detect import router as detect_router
app = FastAPI(title="AgriSathi AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(weather_router)
app.include_router(detect_router)
app.include_router(tts_router)
@app.get("/")
def root():
    return {
        "message": "AgriSathi Backend Running"
    }