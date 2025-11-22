import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import TimeWidget from '../components/TimeWidget';
import EventCard from '../components/EventCard';

interface Event {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  status: 'upcoming' | 'completed';
}

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/events/public');
        setEvents(response.data.events || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex justify-end items-center gap-3">
          {user ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/dashboard"
                  className="glass px-4 md:px-6 py-2 rounded-xl text-white font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/login"
                  className="glass px-4 md:px-6 py-2 rounded-xl text-white font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  to="/signup"
                  className="bg-white text-purple-600 px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </nav>

      {/* Header Section */}
      <header className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-3 text-shadow"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          Event Reminder App
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-white/90 text-center max-w-2xl mx-auto text-shadow"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Never miss an important moment. Create, manage, and get notified about your events.
        </motion.p>
      </header>

      {/* Main Content Section */}
      <main className="container mx-auto px-4 py-6 pb-12 relative z-10">
        {/* Widgets Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <WeatherWidget />
          <TimeWidget />
        </div>

        {/* Events Section */}
        <section className="mt-8">
          <motion.div
            className="flex items-center mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow">
              Upcoming Events
            </h2>
            <div className="h-0.5 flex-1 ml-4 bg-linear-to-r from-white/30 to-transparent rounded-full"></div>
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-white/30 border-t-white"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="glass-dark rounded-2xl p-6 max-w-md mx-auto">
                <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white text-lg font-semibold">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-dark rounded-2xl p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white text-xl font-semibold mb-2">No upcoming events yet</p>
                <p className="text-white/70 mb-4">Create your first event to get started!</p>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-block bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-block bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {!loading && !error && events.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {events.map((event) => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
