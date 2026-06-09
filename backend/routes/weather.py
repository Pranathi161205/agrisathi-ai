from fastapi import APIRouter
from services.weather_service import get_weather
from services.groq_service import ask_agri_ai

router = APIRouter(prefix="/weather")

@router.get("/{location}")
def weather_advisory(location: str):

    weather = get_weather(location)

    if "error" in weather:
        return weather

    temp = weather["current"]["temperature_2m"]
    humidity = weather["current"]["relative_humidity_2m"]

    prompt = f"""
You are an agriculture expert.

Location: {location}
Temperature: {temp}°C
Humidity: {humidity}%

Provide:
1. Farming Advice
2. Irrigation Suggestion
3. Pesticide Warning
4. Risk Level

Keep it concise.
"""

    advice = ask_agri_ai(prompt)

    return {
        "location": location,
        "temperature": temp,
        "humidity": humidity,
        "advice": advice
    }