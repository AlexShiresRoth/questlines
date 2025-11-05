// Service Worker for Push Notifications
self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
    return self.clients.claim();
  });
  
  // Handle push notifications
  self.addEventListener('push', function(event) {
    console.log('Push event received:', event);
    
    if (!event.data) {
      console.log('Push received but no data');
      // Show a default notification when no data is received
      event.waitUntil(
        self.registration.showNotification('New Notification', {
          body: 'You have a new notification',
          icon: '/icon.png',
          badge: '/badge.png'
        })
      );
      return;
    }
    
    try {
      const data = event.data.json();
      console.log('Push data:', data);
      
      const options = {
        body: data.body || 'You have a new notification',
        icon: data.icon || '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        // Required for Chrome Android
        requireInteraction: data.requireInteraction || false,
        // Tag helps with notification grouping in Chrome
        tag: data.tag || 'default-notification',
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.primaryKey || '2',
          url: data.url || 'https://questlines.io/sign-in'
        },
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
      );
    } catch (err) {
      console.error('Error showing notification:', err);
      
      // Fallback notification if parsing JSON fails
      event.waitUntil(
        self.registration.showNotification('New Notification', {
          body: 'You have a new notification',
          icon: '/icon.png',
          badge: '/badge.png'
        })
      );
    }
  });
  
  // Handle notification click
  self.addEventListener('notificationclick', function(event) {
    console.log('Notification click received:', event);
    event.notification.close();
    
    // Use custom URL from notification data if available
    const urlToOpen = event.notification.data?.url || 'https://questlines.io/sign-in';
    
    // Check if a window is already open before opening a new one
    event.waitUntil(
      self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then((clientList) => {
        // Try to focus an existing window with our URL
        for (const client of clientList) {
          const url = new URL(client.url);
          const targetUrl = new URL(urlToOpen);
          
          // Check if we're on the same origin at least
          if (url.origin === targetUrl.origin && 'focus' in client) {
            // Try to focus the existing client
            return client.focus();
          }
        }
        
        // If no existing window, open a new one
        return self.clients.openWindow(urlToOpen);
      })
    );
  });
  
  // Required for some Chrome versions to properly clean up notifications
  self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed', event);
  });