// Service Worker utility functions
// Requirements: 6.1, 6.5

import axiosInstance from '../lib/axios';

/**
 * Get the active service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error('Error getting service worker registration:', error);
      return null;
    }
  }
  return null;
}

/**
 * Check if service worker is registered and active
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return 'PushManager' in window && 'serviceWorker' in navigator;
}

/**
 * Wait for service worker to be ready
 */
export async function waitForServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!isServiceWorkerSupported()) {
    throw new Error('Service Worker is not supported in this browser');
  }
  
  return navigator.serviceWorker.ready;
}

/**
 * Convert base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Get VAPID public key from backend
 * Requirements: 6.1
 */
export async function getVapidPublicKey(): Promise<string> {
  try {
    const response = await axiosInstance.get('/api/notifications/public-key');
    return response.data.publicKey;
  } catch (error) {
    console.error('Error fetching VAPID public key:', error);
    throw new Error('Failed to get VAPID public key');
  }
}

/**
 * Subscribe to push notifications
 * Requirements: 6.1
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    // Check if push notifications are supported
    if (!isPushNotificationSupported()) {
      throw new Error('Push notifications are not supported');
    }

    // Check notification permission
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    // Get service worker registration
    const registration = await waitForServiceWorker();
    
    // Get VAPID public key from backend
    const vapidPublicKey = await getVapidPublicKey();
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Subscribe to push service
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    // Send subscription to backend
    await axiosInstance.post('/api/notifications/subscribe', subscription.toJSON());

    console.log('Successfully subscribed to push notifications');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

/**
 * Check if user is already subscribed to push notifications
 * Requirements: 6.1
 */
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  try {
    if (!isPushNotificationSupported()) {
      return null;
    }

    const registration = await waitForServiceWorker();
    const subscription = await registration.pushManager.getSubscription();
    
    return subscription;
  } catch (error) {
    console.error('Error getting existing subscription:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 * Requirements: 6.1
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const subscription = await getExistingSubscription();
    
    if (!subscription) {
      return true; // Already unsubscribed
    }

    // Unsubscribe from push service
    await subscription.unsubscribe();

    // Notify backend
    await axiosInstance.post('/api/notifications/unsubscribe', {
      endpoint: subscription.endpoint,
    });

    console.log('Successfully unsubscribed from push notifications');
    return true;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}
