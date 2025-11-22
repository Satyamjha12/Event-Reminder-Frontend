import { motion } from 'framer-motion';

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    date: string;
    imageUrl?: string;
    status: 'upcoming' | 'completed';
  };
}

function EventCard({ event }: EventCardProps) {
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

  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
    >
      {/* Event Image */}
      <div className="relative h-40 bg-linear-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-500/20 to-purple-500/20">
            <svg
              className="w-12 h-12 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
              event.status === 'upcoming'
                ? 'bg-emerald-500/90 text-white'
                : 'bg-gray-600/90 text-white'
            }`}
          >
            {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4 bg-linear-to-b from-white/5 to-transparent">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-200 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-white/90 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
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
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
          </div>
          
          <div className="flex items-center text-white/90 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
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
              <span className="font-medium">{formatTime(event.date)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;
