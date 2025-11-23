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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if event is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today, ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    // Check if event is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    // Check if event is this week
    const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil >= 0 && daysUntil <= 7) {
      return 'This Week';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTimeRange = (dateString: string) => {
    const date = new Date(dateString);
    const endDate = new Date(date.getTime() + 90 * 60000); // Add 90 minutes
    const startTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  const getEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeBadge = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const hoursUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60));
    
    if (hoursUntil < 1) {
      return { text: 'In 1 Hour', color: 'bg-purple-500/90' };
    } else if (date.toDateString() === today.toDateString()) {
      return { text: 'Today', color: 'bg-purple-500/90' };
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { text: 'Tomorrow', color: 'bg-pink-500/90' };
    } else {
      const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 7) {
        return { text: 'This Week', color: 'bg-blue-500/90' };
      }
    }
    return null;
  };

  const timeBadge = getTimeBadge(event.date);

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group cursor-pointer"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-500/40 to-purple-500/40">
            <svg
              className="w-16 h-16 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent"></div>
        
        {/* Time Badge */}
        {timeBadge && (
          <div className="absolute top-3 left-3">
            <span className={`${timeBadge.color} text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm`}>
              {timeBadge.text}
            </span>
          </div>
        )}

        {/* Bookmark Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-200 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2.5">
          <div className="flex items-center text-white/80 text-sm">
            <svg
              className="w-4 h-4 mr-2 shrink-0 text-indigo-300"
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
            <span className="font-medium">{formatTimeRange(event.date)}</span>
          </div>
          
          <div className="flex items-center text-white/80 text-sm">
            <svg
              className="w-4 h-4 mr-2 shrink-0 text-indigo-300"
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
            <span className="font-medium">{getEventDate(event.date)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;
