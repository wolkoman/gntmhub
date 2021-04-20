import React, {useEffect, useState} from 'react';
import {useStore} from '../util/store';
import toUint8Array from 'urlb64touint8array';
import {NavigationMenu, NavigationMenuItem} from './Navigation';
import FeatherIcon from 'feather-icons-react';

export function NavigationUserMenu() {

  const [user, setPushEnabled] = useStore(state => [state.user, state.setPushEnabled, state.load()]);
  const [dark, _setDark] = useState(false);
  useEffect(() => _setDark(JSON.parse(localStorage.getItem('dark') ?? 'false')));
  const setDark = (dark: boolean) => {
    localStorage.setItem('dark', JSON.stringify(dark));
    location.reload();
  }
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

  return <NavigationMenu icon={<FeatherIcon icon="user" size="20"/>}>
    <NavigationMenuItem icon={<FeatherIcon icon={dark ? 'sun' : 'moon'}/>} onClick={() => setDark(!dark)}>
      {dark ? 'Helles' : 'Dunkles'} Design
    </NavigationMenuItem>
    {user.admin ? <NavigationMenuItem icon={<FeatherIcon icon="send"/>} onClick={() => user.pushEnabled ? disableNotifications() : askPermission()}>
      Benachrichtung {user.pushEnabled ? "ausschalten":"einschalten"}
    </NavigationMenuItem> : null}
  </NavigationMenu>;
}