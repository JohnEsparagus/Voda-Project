import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getInfo?lat=32.21&lon=23.46');
        setWeatherData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeatherData();
  }, []);

  if (error) return <div className="p-4 bg-red-500 text-white">Error: {error}</div>;
  if (!weatherData) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-black p-4">
          <h1 className="text-2xl font-bold">{weatherData.city}, {weatherData.country}</h1>
          <p>{weatherData.weather.description}</p>
        </div>
        <div className="p-4">
          <div className="flex text-black justify-between items-center">
            <div>
              <h2 className="text-xl text-black font-semibold">Temperature</h2>
              <p> Current: {(weatherData.temperature.current - 273.15).toFixed(2)}째C</p>
              <p> Feels like: {(weatherData.temperature.feels_like - 273.15).toFixed(2)}헍</p>
              <p> Min: {(weatherData.temperature.min - 273.15).toFixed(2)}째C, Max: {(weatherData.temperature.max - 273.15).toFixed(2)}째C</p>
            </div>
            <img
              className="w-20 h-20"
              src={`http://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png`}
              alt={weatherData.weather.description}
            />
          </div>
          <div className="mt-4">
	    <h2 className="text-xl font-semibold text-black">Details</h2>
            <p className="text-black">Humidity: {weatherData.humidity}%</p>
            <p className="text-black">Pressure: {weatherData.pressure} hPa</p>
            <p className="text-black">Visibility: {weatherData.visibility} meters</p>
            <p className="text-black">Wind Speed: {weatherData.wind.speed} m/s</p>
            <p className="text-black">Wind Direction: {weatherData.wind.direction}째</p>
            <p className="text-black">Gust: {weatherData.wind.gust} m/s</p>
            <p className="text-black">Clouds: {weatherData.clouds}%</p>
	  </div>
        </div>
        <div className="bg-gray-100 text-center p-4">
          <p>Sunrise: {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default App;

