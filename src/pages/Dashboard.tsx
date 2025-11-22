import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import EventStats from '../components/EventStats';
import EventList from '../components/EventList';
import CreateEventModal from '../components/CreateEventModal';
import NotificationPermissionPrompt from '../components/NotificationPermissionPrompt';
import { subscribeToPushNotifications, getExistingSubscription } from '../utils/serviceWorker';

interface Event {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  status: 'upcoming' | 'completed';
}

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchEvents();
    checkExistingSubscription();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/events');
      setEvents(response.data.events || []);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.error?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSubscription = async () => {
    try {
      const subscription = await getExistingSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };

  const handleMarkComplete = async (eventId: string) => {
    try {
      await axiosInstance.patch(`/api/events/${eventId}`, {
        status: 'completed',
      });
      // Refresh events to update the list and statistics
      await fetchEvents();
    } catch (err: any) {
      console.error('Error marking event as complete:', err);
      setError(err.response?.data?.error?.message || 'Failed to mark event as complete');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/api/events/${eventId}`);
      // Refresh events to update the list and statistics
      await fetchEvents();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.error?.message || 'Failed to delete event');
    }
  };

  const handlePermissionGranted = async () => {
    console.log('Notification permission granted');
    setSubscriptionError(null);
    
    try {
      // Subscribe to push notifications after permission is granted
      // Requirements: 6.1
      await subscribeToPushNotifications();
      setIsSubscribed(true);
      console.log('Successfully subscribed to push notifications');
    } catch (err: any) {
      console.error('Error subscribing to push notifications:', err);
      setSubscriptionError(err.message || 'Failed to subscribe to notifications');
      setIsSubscribed(false);
    }
  };

  const handlePermissionDenied = () => {
    console.log('Notification permission denied');
    setIsSubscribed(false);
    setSubscriptionError(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Notification Permission Prompt */}
        <NotificationPermissionPrompt
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="glass px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="glass px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow mb-1">
              My Dashboard
            </h1>
            <p className="text-white/80 text-sm">Manage your events and stay organized</p>
          </motion.div>
          
          <motion.button
            className="glass border-2 border-white/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold shadow-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm md:text-base w-full md:w-auto justify-center"
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-white/30 border-t-white mx-auto"></div>
            <p className="text-white text-base mt-4 font-medium">Loading your events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="glass-dark border-2 border-red-400/50 text-white px-4 py-3 rounded-xl mb-6 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold text-sm">Error: {error}</p>
            </div>
          </motion.div>
        )}

        {/* Subscription Error State */}
        {subscriptionError && (
          <motion.div 
            className="glass-dark border-2 border-yellow-400/50 text-white px-4 py-3 rounded-xl mb-6 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold text-sm">Notification Error: {subscriptionError}</p>
            </div>
          </motion.div>
        )}

        {/* Subscription Success State */}
        {isSubscribed && !subscriptionError && (
          <motion.div 
            className="glass-dark border-2 border-emerald-400/50 text-white px-4 py-3 rounded-xl mb-6 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="font-semibold text-sm">
                Push notifications active - You'll receive reminders 30 minutes before events
              </span>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Statistics Section */}
            <EventStats events={events} />

            {/* Event List Section */}
            <EventList 
              events={events} 
              onMarkComplete={handleMarkComplete}
              onDelete={handleDeleteEvent}
            />
          </>
        )}

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={fetchEvents}
        />
      </div>
    </div>
  );
}

export default Dashboard;
