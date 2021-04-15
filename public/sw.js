self.addEventListener('install', () => {
  //console.log("installed");
});
self.addEventListener('activate', () => {
  console.log("activated 5");
});
self.addEventListener('fetch',  (event) => {
  //console.log("Fetch event", event);
  event.respondWith(fetch(event.request));
});
self.addEventListener('push', event => {
  event.waitUntil(new Promise((res,rej) => {
    if (event.data) {
      console.log('This push event has data: ', event.data.text());
      const json = event.data.json();
      if(json.notification){
        res(self.registration.showNotification(json.notification.title, json.notification));
      }
    } else {
      console.log('This push event has no data.');
      res();
    }
  }));
});