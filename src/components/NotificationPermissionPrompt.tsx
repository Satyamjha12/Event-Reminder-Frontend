import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isPushNotificationSupported } from '../utils/serviceWorker';

// Requirements: 6.1
// Component to request and display notification permission status

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

interface NotificationPermissionPromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

function NotificationPermissionPrompt({ 
  onPermissionGranted, 
  onPermissionDenied 
}: NotificationPermissionPromptProps) {
  const [permissionState, setPermissionState] = useState<PermissionState>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    if (!isPushNotificationSupported()) {
      setPermissionState('unsupported');
      return;
    }

    // Get current permission state
    const currentPermission = Notification.permission;
    setPermissionState(currentPermission as PermissionState);

    // Show prompt if permission is default (not yet requested)
    if (currentPermission === 'default') {
      setShowPrompt(true);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission as PermissionState);
      
      if (permission === 'granted') {
        setShowPrompt(false);
        onPermissionGranted?.();
      } else if (permission === 'denied') {
        setShowPrompt(false);
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setPermissionState('denied');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowPrompt(false);
  };

  // Don't render anything if unsupported or dismissed
  if (permissionState === 'unsupported' || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Permission Request Prompt */}
      <AnimatePresence>
        {showPrompt && permissionState === 'default' && (
          <motion.div
            className="fixed top-4 right-4 z-50 max-w-md"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-purple-600">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enable Notifications
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Get notified 30 minutes before your events start. Stay on top of your schedule!
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <motion.button
                      onClick={requestPermission}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Enable
                    </motion.button>
                    <motion.button
                      onClick={handleDismiss}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Not Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Status Indicator */}
      <AnimatePresence>
        {permissionState !== 'default' && !isDismissed && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {permissionState === 'granted' && (
              <div className="bg-green-500/20 backdrop-blur-md border border-green-500 text-white px-4 py-3 rounded-lg flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Notifications enabled - You'll receive reminders 30 minutes before events
                </span>
              </div>
            )}

            {permissionState === 'denied' && (
              <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500 text-white px-4 py-3 rounded-lg flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    Notifications blocked - To enable, update your browser settings
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NotificationPermissionPrompt;
