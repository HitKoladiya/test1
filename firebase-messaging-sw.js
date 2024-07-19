// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey:'AIzaSyDUOLhkvau96w_ClMYHtujA0HQlm6LV8Go',
  authDomain:'astroguide-35db7.firebaseapp.com',
  projectId:'astroguide-35db7',
  storageBucket:'astroguide-35db7.appspot.com',
  messagingSenderId:'170894307366',
  appId:'1:170894307366:web:8fa49f23d0747e554136e7',
  measurementId:'G-10BBVPY06J',
});

// service Worker Related start -----
const CACHE_NAME = 'my-cache';
self.addEventListener('install', e => {
  console.log('installing service worker!!!')
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `static/js/bundle.js`
      ]).then(() => self.skipWaiting())
    })
  )
})

self.addEventListener('activate', event => {
  console.log('activating service worker')
  event.waitUntil(self.clients.claim())
})
/*
self.addEventListener('fetch', function(event) {
  // Add fetch event handling logic here
  console.log('fetching', event.request.url)
  if (navigator.onLine) {
    var fetchRequest = event.request.clone()
    return fetch(fetchRequest).then(
      function (response) {
        if (!response || response.status == 200 || response.type != 'basic') {
          return response;
        }

        var responseToCache = response.clone()
        caches.open(CACHE_NAME)
          .then(function (cache) {
            cache.put(event.request, responseToCache)
          })
          return response;
      }
    )
  }
  else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          }
        })
    )
  }
});
*/
// service Worker Related close -----

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
const notificationData = [];
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  
  // Customize notification here
  const notificationTitle = payload?.data?.title?? 'Background Message Title';
  const notificationOptions = {
    body: payload?.data?.body,
    icon: payload?.data?.image
  };
  notificationData[0] = JSON.stringify(payload)

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', (event) => {
  const payload = event.data.json();
  console.log('[firebase-messaging-sw.js] Received foreground message:', payload);

  notificationData[0] = JSON.stringify(payload)

  // Customize how to handle foreground messages here
  const notificationOptions = {
    // body: payload.notification.body,
    // icon: payload.notification.icon,
    body: payload?.data?.body,
    icon: payload?.data?.icon,
  };

  event.waitUntil(self.registration.showNotification(payload?.data?.title, notificationOptions));
});

self.addEventListener('notificationclick', (event) => {
  // const clickedNotification = event.notification;

  console.log('clicked ::', event, event?.notification, notificationData[0], 'ssss')
  // return
  const urlToOpen = `https://astroguide4u.com/notification/${btoa(notificationData[0])}`;
  // const urlToOpen = `http://localhost:3000/notification/${btoa(notificationData[0])}`;
  event.notification.close();
  event.waitUntil(clients.openWindow(urlToOpen));
});