import React from 'react';
import {Site} from '../components/Site';
import {useStore} from '../util/store';
import {Notification as NotificationComponent} from '../components/Notifications';

export default function NotificationsPage() {
  const [messages] = useStore(state => [state.messages, state.load()]);
  return (
    <Site>
      <div className="flex flex-col my-4">
        {messages.map((message, i) =>
          <NotificationComponent notification={message} key={i}/>
        )}
      </div>
    </Site>
  );
}
