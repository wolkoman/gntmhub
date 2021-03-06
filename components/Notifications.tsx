import React, {useState} from 'react';
import {useStore} from '../util/store';
import {
  CustomMessageEntity,
  HoardMessageEntity,
  MessageEntity,
  PayoutMessageEntity,
  QuestionMessageEntity,
  RefundMessageEntity
} from '../util/DatabaseService';
import {Modal} from './Modal';
import {ArrayElement, GetDto} from '../pages/api/market/get';
import FeatherIcon from 'feather-icons-react';
import {useRouter} from 'next/router';
import {Route} from '../util/routes';

export const Notification = ({notification: n, short}: { short?: boolean, notification: MessageEntity }) => {
  const notificationComponent = short ? ShortNotification : FullNotification;
  const router = useRouter();
  switch (n.type) {
    case 'PAYOUT':
      return notificationComponent({
        notification: n,
        title: `Ihre Dividenden betragen ${(n as PayoutMessageEntity).payouts?.map(payout => payout.amount).reduce((a, b) => a + b, 0).toFixed(2)}gp.`,
        content: ({candidates}) => {
          return <>
            <div>Dividenden</div>
            {(n as PayoutMessageEntity).payouts
              .sort((a, b) => b.amount - a.amount)
              .map((payout, i) =>
                <div key={i} className="p-1 px-2 m-1 border-gray-300 border rounded">
                  {candidates.find(candidate => candidate._id === payout.candidateId)?.name}: {payout.amount.toFixed(2)} gp
                </div>
              )}</>;
        }
      });
    case 'QUESTION':
      return notificationComponent({
        notification: n,
        title: `Durch die richtig beantwortete Bonusfrage erhalten Sie ${(n as QuestionMessageEntity).payout.toFixed(2)}gp.`,
      });
    case 'REFUND':
      return notificationComponent({
        notification: n,
        title: `Sie bekommen ${(n as RefundMessageEntity).payout.toFixed(2)}gp erstattet.`,
      });
    case 'HOARD_DEDUCTION':
      return notificationComponent({
        notification: n,
        title: `Ihnen wurden ${(n as HoardMessageEntity).amount.toFixed(2)}gp abgezogen. (Horterabzug)`
      });
    case 'OPEN_QUESTIONS':
      return notificationComponent({
        notification: n,
        title: "Beantworten Sie Fragen!",
        action: () => router.push(Route.QUESTION)
      });
    case 'CUSTOM':
      return notificationComponent({
        notification: n,
        title: (n as CustomMessageEntity).content,
      });
  }
  return <>undefined</>;
}

type NotificationComponent = (args: {
  content?: ({candidates}) => React.ReactNode,
  title: string,
  notification: ArrayElement<GetDto['messages']>
  action?: () => any
}) => JSX.Element;

const FullNotification: NotificationComponent = ({title, notification, content}) => {
  const [active, setActive] = useState(false);
  const candidates = useStore(state => state.candidates);
  return <>
    <div className="bg-gray-200 dark:bg-gray-800 rounded mb-4 p-4 flex">
      <div className="flex justify-center items-center w-14 flex-shrink-0 border-r border-gray-400 pr-2">
        <FeatherIcon icon={{
          PAYOUT: 'dollar-sign',
          QUESTION: 'help-circle',
          CUSTOM: 'message-circle'
        }[notification.type]}/>
      </div>
      <div className="flex-grow ml-4">
        <div className="text-lg">{title}</div>
        <div className="flex justify-between">
          <div className="text-gray-700 dark:text-gray-400"><DateText date={notification.date}/></div>
          {content ? <div className="border border-gray-600 text-gray-600 rounded px-2 py-1 cursor-pointer"
                          onClick={() => setActive(true)}>Details ansehen</div> : null}
        </div>
      </div>

    </div>
    {active ? <Modal onClose={() => setActive(false)} disabled={false}>
      <div className="p-4">
        {content ? content({candidates}) : null}
      </div>
    </Modal> : null}
  </>;
}
const ShortNotification: NotificationComponent = ({title, notification, content, action}) => {
  const setNotificationRead = useStore(state => state.setNotificationRead);
  return <div className="border-l-8 border-pohutukawa-400 w-full">
    <div className="p-4 border-b border-gray-200">
      <div className="mb-2">{title}</div>
      <div className="flex flex-row justify-between">
        <div className="text-gray-500 text-sm"><DateText date={notification.date}/></div>
        <div onClick={() => action ? action() : setNotificationRead(notification._id)}
             className="border border-pohutukawa-400 text-pohutukawa-400 px-1.5 rounded text-sm cursor-pointer hover:bg-pohutukawa-400 hover:text-white">Okay
        </div>
      </div>
    </div>
  </div>;
}
const DateText = ({date}: { date: string }) => {
  const d = new Date(date);
  return <span>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</span>;
}