import React, {useState} from 'react';
import {useStore} from '../util/store';
import {MessageEntity, PayoutMessageEntity, QuestionMessageEntity, RefundMessageEntity} from '../util/DatabaseService';
import {Modal} from './Modal';
import {ArrayElement, GetDto} from '../pages/api/market/get';

export const Notification = ({notification: n, short}: { short?: boolean, notification: MessageEntity }) => {
  const notificationComponent = short ? FullNotification : FullNotification;
  switch (n.type) {
    case 'PAYOUT':
      return notificationComponent({
        notification: n,
        title: `Ihre Dividenden betragen ${(n as PayoutMessageEntity).payouts?.map(payout => payout.amount).reduce((a, b) => a + b, 0).toFixed(2)}gp.`,
        content: ({candidates}) => {
          return <>{(n as PayoutMessageEntity).payouts
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
  }
  return <>undefined</>;
}

type NotificationComponent = (args: {
  content?: ({candidates}) => React.ReactNode,
  title: string,
  notification: ArrayElement<GetDto['messages']>
}) => JSX.Element;

const FullNotification: NotificationComponent = ({title, notification, content}) => {
  const [active, setActive] = useState(false);
  const candidates = useStore(state => state.candidates);
  return <><div className={`bg-gray-200 rounded mb-4 p-4 ${content ? 'cursor-pointer' : ''}`} onClick={content ? () => setActive(true) : null}>
    <div className="text-lg font-bold">{title}</div>
    <div className="text-gray-700"><DateText date={notification.date}/></div>
  </div>
    {active ? <Modal onClose={() => setActive(false)} disabled={false}>
      {content ? content({candidates}) : null}
    </Modal> : null}
  </>;
}
const DateText = ({date}: { date: string }) => {
  const d = new Date(date);
  return <span>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</span>;
}