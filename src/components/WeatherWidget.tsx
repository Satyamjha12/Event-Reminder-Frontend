import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

interface WeatherWidgetProps {
  onWeatherUpdate?: (description: string) => void;
}

function WeatherWidget({ onWeatherUpdate }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's location
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Using OpenWeatherMap API
            const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
            
            if (!apiKey) {
              // Fallback to mock data if no API key
              setWeather({
                temperature: 22,
                condition: 'Partly Cloudy',
                icon: '02d',
                location: 'Your Location',
              });
              setLoading(false);
              return;
            }

            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );

            if (!response.ok) {
              throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            
            const weatherData = {
              temperature: Math.round(data.main.temp),
              condition: data.weather[0].main,
              icon: data.weather[0].icon,
              location: data.name,
            };
            setWeather(weatherData);
            
            // Generate weather description for greeting
            if (onWeatherUpdate) {
              const temp = weatherData.temperature;
              const condition = weatherData.condition.toLowerCase();
              let description = '';
              
              if (condition.includes('rain')) {
                description = 'The weather is rainy today. Don\'t forget your umbrella!';
              } else if (condition.includes('cloud')) {
                description = 'The weather is looking great for your outdoor meeting.';
              } else if (condition.includes('clear') || condition.includes('sun')) {
                description = 'It\'s a beautiful sunny day. Perfect for outdoor activities!';
              } else if (condition.includes('snow')) {
                description = 'It\'s snowing outside. Stay warm!';
              } else if (temp > 30) {
                description = 'It\'s quite hot today. Stay hydrated!';
              } else if (temp < 10) {
                description = 'It\'s cold outside. Bundle up!';
              } else {
                description = 'The weather is pleasant today.';
              }
              
              onWeatherUpdate(description);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            // Fallback to mock data
            setWeather({
              temperature: 22,
              condition: 'Partly Cloudy',
              icon: '02d',
              location: 'Your Location',
            });
            setLoading(false);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="glass rounded-2xl p-6 shadow-xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass rounded-2xl p-6 shadow-xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white/80 text-center h-32 flex items-center justify-center">
          <p className="text-sm">Weather unavailable</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
            <span className="text-white/60 text-sm font-medium">{weather?.location || 'NYC'}</span>
          </div>
          <p className="text-5xl font-bold text-white mb-2">
            {weather?.temperature}°F
          </p>
          <p className="text-white text-lg font-medium">{weather?.condition}</p>
          <p className="text-white/60 text-sm mt-1">
            H: {weather ? weather.temperature + 3 : 76}° L: {weather ? weather.temperature - 3 : 65}°
          </p>
        </div>
        <div className="shrink-0">
          {weather?.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.condition}
              className="w-24 h-24 drop-shadow-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;
