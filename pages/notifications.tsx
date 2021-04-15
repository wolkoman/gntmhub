import React from 'react';
import {Site} from '../components/Site';
import {useStore} from '../util/store';
import toUint8Array from 'urlb64touint8array';
import {Notification as NotificationComponent} from '../components/Notifications';

export default function NotificationsPage() {
  const [messages, user, setPushEnabled] = useStore(state => [state.messages, state.user, state.setPushEnabled, state.load()]);
  const askPermission = () => new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(resolve);
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
    .then(permissionResult => {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    }).then(() => navigator.serviceWorker.register('/sw.js'))
    .then(registration => registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: toUint8Array(
        'BL5DirHsa0Z5MTmaqp0UseARxfx2bhK1wJuD7knbhCugD1z99DkGQwgkxxEAw08xapCC_XDIkd7m1Tu7PV5fN5s'
      )
    }))
    .then(pushSubscription => {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      fetch('/api/user/push', {
        method: 'POST',
        body: JSON.stringify({pushSubscription}),
        headers: {'Content-Type': 'application/json'}
      });
      setPushEnabled(true);
    });

  const disableNotifications = () => {
    fetch('/api/user/push', {
      method: 'POST',
      body: JSON.stringify({pushSubscription: null}),
      headers: {'Content-Type': 'application/json'}
    });
    setPushEnabled(false);
  };

  return (
    <Site>
      {user?.admin ?
      <div className="flex justify-end">
        {user?.pushEnabled ?
          <div className="cursor-pointer" onClick={disableNotifications}>Benachrichtigungen ausschalten</div> :
          <div className="cursor-pointer" onClick={askPermission}>Benachrichtigungen einschalten</div>}
      </div> : null}
      <div className="flex flex-col my-4">
        {messages.map((message, i) =>
          <NotificationComponent notification={message} key={i}/>
        )}
      </div>
    </Site>
  );
}
