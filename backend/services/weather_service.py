import requests

def get_weather(location: str):

    geo_url = (
        "https://geocoding-api.open-meteo.com/v1/search"
        f"?name={location}&count=1"
    )

    geo = requests.get(geo_url).json()

    if "results" not in geo:
        return {
            "error": "Location not found"
        }

    lat = geo["results"][0]["latitude"]
    lon = geo["results"][0]["longitude"]

    weather_url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}"
        f"&longitude={lon}"
        "&current=temperature_2m,relative_humidity_2m"
    )

    return requests.get(weather_url).json()