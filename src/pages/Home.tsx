import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  createdBy?: string;
}

function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [weatherDescription, setWeatherDescription] = useState('');

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch user's events if logged in, otherwise public events
        const endpoint = user ? '/api/events' : '/api/events/public';
        const response = await axios.get(endpoint);
        setEvents(response.data.events || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Calculate event statistics
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'upcoming').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  // Get user's name from email (first part before @)
  const getUserName = () => {
    if (!user?.email) return 'Guest';
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Suppress unused variable warning - keeping for future use
  console.debug('Home component loaded');

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="container mx-auto px-4 md:px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg hidden sm:inline">EventFlow</span>
          </motion.div>

          {/* Right side navigation */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    to="/dashboard"
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-semibold transition-all inline-flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-all relative">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-all"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserName().charAt(0)}
                  </div>
                  <span className="text-white font-medium text-sm hidden sm:inline">{getUserName()}</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 md:px-6 py-2 rounded-lg text-white font-semibold transition-all inline-flex items-center gap-2 text-sm"
                  >
                    Login
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <main className="container mx-auto px-4 md:px-6 pt-28 pb-12 relative z-10 max-w-7xl space-y-12">
        {/* System Status Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-xs font-medium">System Online</span>
          </motion.div>
        </div>

        {/* Greeting Section */}
        <motion.div
          className="mb-28 flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {greeting},
            <br />
            <span className="text-white">{user ? getUserName() : 'Guest'}</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl">
            {user 
              ? `You have ${upcomingEvents.length} upcoming ${upcomingEvents.length === 1 ? 'event' : 'events'} today. ${weatherDescription || 'The weather is looking great for your outdoor meeting.'}`
              : 'Sign in to manage your events and never miss an important moment.'
            }
          </p>
        </motion.div>

        {/* Widgets Section - Time and Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-50 mx-auto max-w-4xl">
          <TimeWidget />
          <WeatherWidget onWeatherUpdate={setWeatherDescription} />
        </div>

        {/* Statistics Cards */}
        {user && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Total Events */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-green-400 text-xs font-semibold bg-green-400/20 px-2 py-1 rounded">+12%</span>
              </div>
              <p className="text-white/60 text-sm mb-1">Total Events</p>
              <p className="text-white text-3xl font-bold">{totalEvents}</p>
            </div>

            {/* Active Events */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-pink-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-blue-400 text-xs font-semibold bg-blue-400/20 px-2 py-1 rounded">Now</span>
              </div>
              <p className="text-white/60 text-sm mb-1">Active Events</p>
              <p className="text-white text-3xl font-bold">{activeEvents}</p>
            </div>

            {/* Completed Events */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-purple-400 text-xs font-semibold bg-purple-400/20 px-2 py-1 rounded">All time</span>
              </div>
              <p className="text-white/60 text-sm mb-1">Completed</p>
              <p className="text-white text-3xl font-bold">{completedEvents}</p>
            </div>
          </motion.div>
        )}

        {/* Upcoming Events Section */}
        <section className="mt-8">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Upcoming Events
              </h2>
              <p className="text-white/60 text-sm">Manage your schedule effectively</p>
            </div>
            {user && upcomingEvents.length > 0 && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
                  All
                </button>
                <button className="px-4 py-2 bg-white/10 text-white/70 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                  Active
                </button>
                <button className="px-4 py-2 bg-white/10 text-white/70 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                  Completed
                </button>
              </div>
            )}
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-white/30 border-t-white"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/20">
                <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white text-lg font-semibold">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && upcomingEvents.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/20">
                <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white text-xl font-semibold mb-2">No upcoming events yet</p>
                <p className="text-white/70 mb-4">Create your first event to get started!</p>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {!loading && !error && upcomingEvents.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {upcomingEvents.slice(0, 6).map((event) => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Floating Help Button */}
        <motion.button
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      </main>
    </div>
  );
}

export default Home;
