from fastapi import APIRouter, UploadFile, File
from dotenv import load_dotenv
from groq import Groq
import os
import base64
import json

load_dotenv()

router = APIRouter(prefix="/detect")

@router.post("/")
async def detect_disease(file: UploadFile = File(...)):

    client = Groq(
        api_key=os.getenv("GROQ_API_KEY")
    )

    image_bytes = await file.read()

    encoded = base64.b64encode(image_bytes).decode()

    prompt = """
Analyze this crop leaf image.

Return ONLY valid JSON.

{
  "disease": "",
  "confidence": 0.0,
  "symptoms": "",
  "recommendation": "",
  "warning": ""
}

Rules:
- confidence must be a decimal between 0 and 1
- return only JSON
- no markdown
- no bullet points
- no extra text
"""

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{encoded}"
                        }
                    }
                ]
            }
        ]
    )

    content = response.choices[0].message.content

    print("RAW RESPONSE:")
    print(content)

    try:
        result = json.loads(content)
        return result

    except Exception as e:
        return {
            "disease": "Unknown",
            "confidence": 0.0,
            "symptoms": "",
            "recommendation": "",
            "warning": "",
            "analysis": content,
            "error": str(e)
        }