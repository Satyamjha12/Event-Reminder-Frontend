import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function TimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className="glass rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Decorative clock icon background */}
      <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg className="w-20 h-20 md:w-24 md:h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
        </svg>
      </div>

      <div className="text-center relative z-10">
        <div className="flex items-center justify-center gap-1.5 mb-2 md:mb-3">
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Current Time</p>
        </div>
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 font-mono text-shadow">
          {formatTime(currentTime)}
        </p>
        <div className="h-px w-16 md:w-20 bg-white/30 mx-auto mb-2 md:mb-3"></div>
        <p className="text-white/95 text-xs md:text-sm font-medium">
          {formatDate(currentTime)}
        </p>
      </div>
    </motion.div>
  );
}

export default TimeWidget;
