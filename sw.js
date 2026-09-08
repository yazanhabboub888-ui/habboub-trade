const CACHE='econova-shell-v6';

self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request).then(r=>r||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain'}}))));
    return;
  }
  event.respondWith(fetch(request).then(response=>{
    if(response.ok&&['style','script','image','font'].includes(request.destination)){
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});
    }
    return response;
  }).catch(()=>caches.match(request)));
});

// Web Push: the service worker is ready to display ECONOVA notifications.
self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch(_){data={body:event.data?event.data.text():''};}
  const title=data.title||'ECONOVA';
  const options={
    body:data.body||'لديك إشعار جديد من ECONOVA',
    icon:data.icon||'/econova-icon.svg',
    badge:data.badge||'/econova-icon.svg',
    tag:data.tag||'econova-notification',
    renotify:true,
    data:{url:data.url||'/'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'/',self.location.origin).href;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){
      if('focus' in client){client.navigate(target);return client.focus();}
    }
    return clients.openWindow(target);
  }));
});
