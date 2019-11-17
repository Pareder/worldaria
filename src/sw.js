const CACHE_NAME = 'my-cache'

const myCache = [
  '/',
  '/css/app.5cca1f5d.css',
  '/js/vendor.ccab4910.js',
  '/js/app.cb26084f.js',
  '/fonts/Michroma.woff2',
  '/fonts/Montserrat-Regular.woff2',
  '/img/information.8aac99e3.svg',
  '/img/question-mark.885ff8fd.svg',
  '/img/saved.088fd169.svg',
  '/img/down.cac6238e.svg',
  '/img/cancel.e85191c6.svg',
  '/img/back.svg',
  '/json/full.json',
  '/json/map.json',
  '/json/custom.json',
  '/json/timezones.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Cache Opened')
      return cache.addAll(myCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
})

self.addEventListener('push', (event) => {
  const data = ev.data.json()
  self.registration.showNotification(data.title, {
    body: 'Hello, World!',
    icon: 'https://images.all-free-download.com/images/graphiclarge/harry_potter_icon_6825007.jpg'
  })
})