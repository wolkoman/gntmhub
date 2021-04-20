import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {useStore} from '../util/store';
import {Route} from '../util/routes';
import {useRouter} from 'next/router';
import FeatherIcon from 'feather-icons-react';
import {Notification} from './Notifications';
import OutsideClickHandler from 'react-outside-click-handler';

export function Navigation() {
  const [isLoggedIn, messages] = useStore(state => [state.isLoggedIn(), state.messages, state.loading]);
  const unreadMessages = messages.filter(m => m.unread);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, _setDark] = useState(false);
  const router = useRouter();
  const setDark = (dark: boolean) => {
    localStorage.setItem('dark', JSON.stringify(dark));
    location.reload();
  }
  useEffect(() => _setDark(JSON.parse(localStorage.getItem('dark') ?? 'false')));
  return (
    <div
      className={`p-4 bg-white dark:bg-gray-900 dark:text-gray-200 flex items-center justify-between top-0 z-20 ${router.asPath === Route.HOMEPAGE ? '' : 'sticky'}`}>
      <Link href="/">
        <div className="text-2xl font-serif font-bold cursor-pointer hidden md:block">
          gntmhub
        </div>
      </Link>
      {isLoggedIn ? <div className="flex flex-row w-full md:w-auto justify-around">
        {
          Object.entries({
            [Route.TRADE]: 'Handel',
            [Route.QUESTION]: 'Fragen',
            [Route.LEADERBOARD]: 'Rangliste',
          }).map(([href, title]) => <Link href={href}>
            <div className="text-md cursor-pointer px-1 px-4 uppercase">
              {title}
            </div>
          </Link>)
        }

        <NavigationMenu icon={<div>
          <FeatherIcon icon="bell" size="20"/>
          {unreadMessages.length > 0 ?
            <div className="absolute top-0 right-0 w-2 h-2 bg-pohutukawa-300 rounded-3xl"/> : null}
        </div>}>
          {unreadMessages.length > 0 ? unreadMessages.slice(0,3).map(notification =>
            <Notification notification={notification} short={true}/>
          ) : null}
          {unreadMessages.length === 0 ? <div className="h-24 flex flex-col justify-center items-center">
            <div className="text-lg flex"> Keine Neuigkeiten</div>
            <Link href={Route.NOTIFICATIONS}>
              <div className="text-sm px-1 border border-gray-400 text-gray-400 rounded mt-2 cursor-pointer">
                Benachrichtigungen ansehen
              </div>
            </Link>
          </div> : null}
        </NavigationMenu>

        <NavigationMenu icon={<FeatherIcon icon="user" size="20"/>}>
          <NavigationMenuItem icon={<FeatherIcon icon={dark ? 'sun' : 'moon'}/>} onClick={() => setDark(!dark)}>
            {dark ? 'Helles' : 'Dunkles'} Design
          </NavigationMenuItem>
          <NavigationMenuItem icon={<FeatherIcon icon="send"/>} onClick={() => setDark(!dark)}>
            Benachrichtung einschalten
          </NavigationMenuItem>
        </NavigationMenu>
      </div> : null}
    </div>
  );
}

const NavigationMenu = ({icon, children}) => {
  const [open, setOpen] = useState(false);
  return <div className="text-md px-1 px-4 relative">
    <div className="cursor-pointer relative" onClick={() => setOpen(x => !x)}>
      {icon}
    </div>
    {open ? <>
      <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <div
          className="bg-white dark:bg-gray-900 absolute z-20 top-full right-0 w-64 max-h-96 flex flex-col justify-center items-center rounded shadow-2xl transform translate-y-4 overflow-y-auto">
          {children}
        </div>
      </OutsideClickHandler>
    </> : null}
  </div>;
}

const NavigationMenuItem = ({icon, children, onClick}) => {
  return <div className="flex justify-between p-3 px-6 w-full cursor-pointer" onClick={onClick}>
    <div>{children}</div>
    <div>{icon}</div>
  </div>
}