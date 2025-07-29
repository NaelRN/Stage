import { useState } from 'react';
import './WeatherApp.css';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = 'a6a33f4a4e57575ba77a02b2f31d4890'; 

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]);

    try {

      const resWeather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`
      );
      if (!resWeather.ok) throw new Error('Ville non trouvée');
      const dataWeather = await resWeather.json();
      setWeather(dataWeather);

      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`
      );
      const dataForecast = await resForecast.json();
      const filtered = dataForecast.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecast(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Drizzle': return '🌦️';
      case 'Thunderstorm': return '⛈️';
      case 'Snow': return '❄️';
      default: return '🌡️';
    }
  };

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo" className="fixed-logo" />

      <h1>🌦️Thomson Météo</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Entrez une ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Voir la météo</button>
      </div>

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Chargement des données météo...</p>
        </div>
      )}

      {error && <p className="error">❌ {error}</p>}

      {weather && (
        <div className="weather-section">
          <div className="weather-current">
            <h2>{weather.name}</h2>
            <p>{getWeatherIcon(weather.weather[0].main)} {weather.weather[0].description}</p>
            <p>🌡️ Température : {weather.main.temp} °C</p>
            <p>💧 Humidité : {weather.main.humidity}%</p>
            <p>💨 Vent : {weather.wind.speed} m/s</p>
            <p>🔽 Pression : {weather.main.pressure} hPa</p>
          </div>

          <div className="forecast">
            <h3>Prévisions 5 jours</h3>
            <div className="forecast-grid">
              {forecast.map((item, index) => (
                <div key={index} className="forecast-card">
                  <strong>{new Date(item.dt_txt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                  <p>{getWeatherIcon(item.weather[0].main)} {item.weather[0].description}</p>
                  <p>🌡️ {item.main.temp} °C</p>
                  <p>💨 {item.wind.speed} m/s</p>
                  <p>🔽 {item.main.pressure} hPa</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
