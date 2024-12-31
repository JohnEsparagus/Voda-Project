from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

APIKEY = "5a226cff73d2d2fba6eb7353b29b7e5b"

def fetch_weather_data(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={APIKEY}"
    payload = {}
    headers = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    print(response.text)
    print(f"Requesting URL: {url}")  # Debug: Print the URL
    
    print(f"Response Status Code: {response.status_code}")  # Debug: Print status code
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Response Text: {response.text}")  # Debug: Print response text if request fails
        return None

@app.route('/getInfo', methods=['GET'])
def getWeather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Missing latitude or longitude"}), 400

    weather_data = fetch_weather_data(lat, lon)
    if not weather_data:
        return jsonify({"error": "Could not fetch weather data"}), 500

    try:
        response_data = {
            "coordinates": {
                "latitude": weather_data['coord']['lat'],
                "longitude": weather_data['coord']['lon']
            },
            "weather": {
                "main": weather_data['weather'][0]['main'],
                "description": weather_data['weather'][0]['description'],
                "icon": weather_data['weather'][0]['icon']
            },
            "temperature": {
                "current": weather_data['main']['temp'],
                "feels_like": weather_data['main']['feels_like'],
                "min": weather_data['main']['temp_min'],
                "max": weather_data['main']['temp_max']
            },
            "pressure": weather_data['main']['pressure'],
            "humidity": weather_data['main']['humidity'],
            "visibility": weather_data['visibility'],
            "wind": {
                "speed": weather_data['wind']['speed'],
                "direction": weather_data['wind']['deg'],
                "gust": weather_data.get('wind', {}).get('gust')  # Gust is optional
            },
            "clouds": weather_data['clouds']['all'],
            "city": weather_data['name'],
            "country": weather_data['sys']['country'],
            "sunrise": weather_data['sys']['sunrise'],
            "sunset": weather_data['sys']['sunset'],
            "timezone_offset": weather_data['timezone']
        }
    except KeyError as e:
        print(f"Missing key in response: {e}")
        return jsonify({"error": f"Missing key in response: {e}"}), 500

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)

