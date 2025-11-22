// Service Worker for Push Notifications
// Requirements: 6.1, 6.5

// Install event - cache any necessary resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches if needed
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  let notificationData = {
    title: 'Event Reminder',
    body: 'You have an upcoming event',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'event-reminder',
    requireInteraction: false,
    data: {
      url: '/dashboard'
    }
  };

  // Parse the push notification payload
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        tag: payload.tag || notificationData.tag,
        requireInteraction: payload.requireInteraction || notificationData.requireInteraction,
        data: {
          url: payload.url || notificationData.data.url,
          eventId: payload.eventId
        }
      };
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error);
    }
  }

  // Display the notification
  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data
    }
  );

  event.waitUntil(promiseChain);
});

// Notification click event - handle user clicking on notification
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  // Close the notification
  event.notification.close();

  // Get the URL to open (default to dashboard)
  const urlToOpen = event.notification.data?.url || '/dashboard';

  // Open or focus the dashboard
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a window open with the app
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        const clientUrl = new URL(client.url);
        
        // If we find a client with our origin, focus it and navigate to dashboard
        if (clientUrl.origin === self.location.origin) {
          if (client.url !== urlToOpen) {
            return client.navigate(urlToOpen).then(client => client.focus());
          }
          return client.focus();
        }
      }
      
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
