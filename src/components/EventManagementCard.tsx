import { motion } from 'framer-motion';
import { useState } from 'react';

interface EventManagementCardProps {
  event: {
    _id: string;
    title: string;
    date: string;
    imageUrl?: string;
    status: 'upcoming' | 'completed';
  };
  onMarkComplete: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

function EventManagementCard({ event, onMarkComplete, onDelete }: EventManagementCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  const handleMarkComplete = () => {
    setShowCompleteConfirm(true);
  };

  const confirmMarkComplete = () => {
    onMarkComplete(event._id);
    setShowCompleteConfirm(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(event._id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
      >
        {/* Event Image */}
        <div className="relative h-48 bg-linear-to-br from-purple-500/20 to-pink-500/20 overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                event.status === 'upcoming'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
            {event.title}
          </h3>
          
          <div className="flex items-center text-white/80 text-sm space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatTime(event.date)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {event.status === 'upcoming' && (
              <button
                onClick={handleMarkComplete}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Complete
              </button>
            )}
            
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-3">Delete Event</h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mark Complete Confirmation Dialog */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-3">Mark as Complete</h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to mark "{event.title}" as completed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmMarkComplete}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Mark Complete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default EventManagementCard;
