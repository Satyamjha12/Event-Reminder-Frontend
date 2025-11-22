import { useState } from 'react';
import { motion } from 'framer-motion';
import EventManagementCard from './EventManagementCard';

interface Event {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  status: 'upcoming' | 'completed';
}

interface EventListProps {
  events: Event[];
  onMarkComplete: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

type FilterType = 'all' | 'active' | 'completed';

function EventList({ events, onMarkComplete, onDelete }: EventListProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const filteredEvents = events.filter((event) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return event.status === 'upcoming';
    if (selectedFilter === 'completed') return event.status === 'completed';
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const getEmptyStateMessage = () => {
    switch (selectedFilter) {
      case 'active':
        return 'No active events found. Create a new event to get started!';
      case 'completed':
        return 'No completed events yet. Mark events as complete to see them here.';
      default:
        return 'No events found. Create your first event to get started!';
    }
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {filters.map((filter) => (
          <motion.button
            key={filter.value}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedFilter === filter.value
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setSelectedFilter(filter.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Event Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.map((event) => (
            <motion.div key={event._id} variants={itemVariants}>
              <EventManagementCard 
                event={event} 
                onMarkComplete={onMarkComplete}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-white/40 mx-auto mb-4"
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
            <p className="text-white text-lg">{getEmptyStateMessage()}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default EventList;
