import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<any>(null)

  // OpenWeatherMap API Key
  const API_KEY = "4ac7eedafc7af3aaa0875ace9f6ef375"

  // Function to determine background gradient based on weather condition
  const getBGColor = () => {
    if (!weather) return "from-blue-400 to-blue-700"; // Default background

    const status = weather.weather[0].main.toLowerCase();
    
    if (status.includes("clear")) return "from-blue-600 via-indigo-700 to-purple-800";
    if (status.includes("cloud")) return "from-gray-400 to-blue-400";
    if (status.includes("rain")) return "from-blue-800 to-gray-900";
    if (status.includes("haze") || status.includes("mist")) return "from-teal-400 to-gray-500";

    return "from-blue-500 to-indigo-700";
  };

  // Function to fetch weather data from API
  const getWeather = async () => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      // Check if city exists
      if (data.cod === "404" || data.cod === 404) {
        alert("City not found! Please check the spelling.");
        setWeather(null);
      } else if (data.cod === 200) {
        setWeather(data);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Network error. Please check your internet connection.");
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBGColor()} flex flex-col items-center justify-center p-4 transition-all duration-700`}>

      {/* Main Glassmorphism Card */}
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center text-white">
        <h1 className="text-4xl font-black mb-6 drop-shadow-md">Klimate 🌤️</h1>

        {/* Input Section */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search city (e.g. Kochi)"
            className="flex-1 p-3 bg-white/20 border border-white/40 rounded-xl outline-none placeholder:text-white/70 focus:bg-white/30 transition-all"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getWeather()}
          />
          <button
            onClick={getWeather}
            className="bg-white text-blue-600 font-bold px-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Go
          </button>
        </div>

        {/* Weather Result Display */}
        {weather && (
          <div className="animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold">{weather.name}, {weather.sys?.country}</h2>

            <div className="flex flex-col items-center my-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt="weather icon"
                className="w-32 h-32 drop-shadow-lg"
              />
              <p className="text-7xl font-black tracking-tighter">{Math.round(weather.main.temp)}°C</p>
              <p className="text-xl font-medium capitalize mt-2 opacity-90">{weather.weather[0].description}</p>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
              <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-xs uppercase opacity-70 font-bold mb-1">Humidity</p>
                <p className="text-xl font-bold">{weather.main.humidity}%</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-xs uppercase opacity-70 font-bold mb-1">Wind Speed</p>
                <p className="text-xl font-bold">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}

        {/* Display message when no city is searched */}
        {!weather && (
          <p className="text-white/70 italic">Search for a city to see the magic!</p>
        )}
      </div>

      <p className="mt-6 text-white/50 text-sm font-medium">Built with React + Vite + Tailwind</p>
    </div>
  )
}

export default App