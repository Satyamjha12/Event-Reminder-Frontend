import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

function WeatherWidget() {
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
            
            setWeather({
              temperature: Math.round(data.main.temp),
              condition: data.weather[0].main,
              icon: data.weather[0].icon,
              location: data.name,
            });
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
      className="glass rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-white/80 text-xs font-medium truncate">{weather?.location}</p>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-white mb-2 text-shadow">
            {weather?.temperature}°
          </p>
          <p className="text-white/95 text-sm md:text-base font-medium">{weather?.condition}</p>
        </div>
        <div className="shrink-0 ml-2 md:ml-3">
          {weather?.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.condition}
              className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;
