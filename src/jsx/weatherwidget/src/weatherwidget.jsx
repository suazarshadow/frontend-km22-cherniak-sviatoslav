import React, { useState } from "react";
import "./weatherwidget.css";

const WeatherWidget = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  const weatherIcons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️"
  };

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeatherData([]);
    setCurrentWeather(null);

    try {
      // Поточний прогноз
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${"10afa583139ecaaea32da9a5a40b4f87"}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error("Місто не знайдено");
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);

      // Прогноз на 5 днів
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${"10afa583139ecaaea32da9a5a40b4f87"}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      const filtered = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
      setWeatherData(filtered);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="weather-app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Введіть місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          className="city-input"
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="search-button"
        >
          {loading ? "..." : "Пошук"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {currentWeather && (
        <div className="current-weather">
          <div className="location">
            {currentWeather.name}, {currentWeather.sys.country}
          </div>
          <div className="temp">
            {Math.round(currentWeather.main.temp)}°C
          </div>
          <div className="weather-icon">
            {weatherIcons[currentWeather.weather[0].main]}
          </div>
          <div className="description">
            {currentWeather.weather[0].description}
          </div>
        </div>
      )}

      {weatherData.length > 0 && (
        <div className="forecast">
          <div className="forecast-title">Прогноз на 5 днів</div>
          <div className="forecast-cards">
            {weatherData.map((item, index) => {
              const date = new Date(item.dt * 1000);
              const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });
              
              return (
                <div key={index} className="forecast-card">
                  <div className="day">{dayName}</div>
                  <div className="icon">
                    {weatherIcons[item.weather[0].main]}
                  </div>
                  <div className="temp">
                    {Math.round(item.main.temp)}°C
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;