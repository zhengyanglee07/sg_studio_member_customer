// public/sw.js
self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");
   if (event.data) {
     const data = event.data.json();
     const options = {
       body: data.body,
       icon: data.icon || "/blavk-sg-studio-white-bg-logo.png",
      //  image: data.image || "/blavk-sg-studio-white-bg-logo.png",
      //  badge: "/blavk-sg-studio-white-bg-logo.png",
       vibrate: [100, 50, 100],
       data: {
         dateOfArrival: Date.now(),
         primaryKey: "2",
       },
     };
     event.waitUntil(self.registration.showNotification(data.title, options));
   }
 });
 
 self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
 