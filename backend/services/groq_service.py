from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

print("GROQ SERVICE KEY =", os.getenv("GROQ_API_KEY"))

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_agri_ai(question: str, language: str = "English"):
    try:
        prompt = f"""
You are AgriSathi AI, an agriculture expert.

Respond completely in {language}.

Provide:
1. Cause
2. Recommendation
3. Precautions
4. When to consult expert

Keep answers concise.

Question:
{question}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Groq Error: {str(e)}"