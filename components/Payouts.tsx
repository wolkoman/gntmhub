import React, {useEffect, useState} from 'react';
import {useStore} from '../util/store';
import {PayoutMessageEntity} from '../util/DatabaseService';
import {Modal} from './Modal';
import {Route} from '../util/routes';
import Link from 'next/link';

export default function Payouts() {
  const [candidates, messages] = useStore(state => [
    state.candidates, state.messages, state.loadMessages(), state.load()
  ]);
  const [activePayout, setActivePayout] = useState<number>();
  const [nextPayouts, setNextPayouts] = useState([]);
  const [remainingPayoutTime, setRemainingPayoutTime] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNextPayouts(nextPayouts => nextPayouts.filter(date => date.getTime() >= new Date().getTime()));
      if(nextPayouts.length === 0 && remainingPayoutTime) {
        setRemainingPayoutTime(null);
      }else if(nextPayouts.length > 0){
        setRemainingPayoutTime((nextPayouts[0].getTime() - new Date().getTime()));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPayouts]);

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {messages
        .map((message, i) => <div key={i}>
          <div className={`bg-gray-200 p-3 rounded flex justify-between ${message.type === "QUESTION" ? "pointer-events-none" : "cursor-pointer"}`}
               onClick={() => setActivePayout(i)}>
            <div>{message.type === "PAYOUT" ? "Dividenauszahlung" : "Bonusfrage"} vom <DateText date={message.date}/></div>
            <div className="font-bold">{message.type === "PAYOUT"
              ? message['payouts'].map(payout => payout.amount).reduce((a, b) => a + b, 0).toFixed(2)
              : message['payout']
            } gp
            </div>
          </div>
          {activePayout === i ? <Modal disabled={false} onClose={() => setActivePayout(null)}>
            <div className="p-6">
              <div className="font-serif text-3xl mb-6">{message.type === "PAYOUT" ? "Dividenauszahlung" : "Bonusfrage"} vom <DateText date={message.date}/></div>
              <div className="flex flex-wrap">
                {(message as PayoutMessageEntity).payouts.sort((a, b) => b.amount - a.amount).map((payout, i) =>
                  <div key={i} className="p-1 px-2 m-1 border-gray-300 border rounded">
                    {candidates.find(candidate => candidate._id === payout.candidateId)?.name}: {payout.amount.toFixed(2)} gp
                  </div>
                )}
              </div>
            </div>
          </Modal> : null}
        </div>)}
      {nextPayouts.length > 0 ? <Link href={Route.GIVEAWAY}>
        <div className="bg-gray-400 p-3 rounded mb-4 cursor-pointer flex justify-between">
          <div>Nächste Auszahlung</div>
          <div className="font-bold"><TimeText time={remainingPayoutTime}/></div>
        </div>
      </Link> : null }
    </div>
  );
}

const DateText = ({date}: { date: string }) => {
  const d = new Date(date);
  return <span>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</span>;
}
const TimeText = ({time}: { time: number }) => {
  const d = new Date(time);
  return <span>{(d.getHours()-1).toString().padStart(2, '0')}:{d.getMinutes().toString().padStart(2, '0')}:{d.getSeconds().toString().padStart(2, '0')}</span>;
}