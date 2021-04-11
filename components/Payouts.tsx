import React, {useEffect, useState} from 'react';
import {useStore} from '../util/store';
import {PayoutMessageEntity} from '../util/DatabaseService';
import {Modal} from './Modal';
import {Route} from '../util/routes';
import Link from 'next/link';

export default function Payouts() {
  const [candidates, messages] = useStore(state => [
    state.candidates, state.messages, state.load()
  ]);
  const [activePayout, setActivePayout] = useState<number>();

  return (
    <div className="flex flex-row overflow-x-scroll my-4">
      {messages.map((message, i) =>

        <div key={i}>
          <div className={`bg-gray-200 p-3 rounded flex flex-col ml-2 ${(message.type === 'PAYOUT' ? 'cursor-pointer' : 'pointer-events-none')}`}
               onClick={() => setActivePayout(i)}>
            <div className="font-bold text-lg text-center">{message.type === "PAYOUT"
              ? message['payouts'].map(payout => payout.amount).reduce((a, b) => a + b, 0).toFixed(2)
              : message['payout'].toFixed(2)
            }
            </div>
            <div className="text-sm text-center">{{PAYOUT: "Dividenden", QUESTION: "Bonusfrage", REFUND: "Erstattung"}[message.type]}</div>
            <div className="text-center"><DateText date={message.date}/></div>
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
        </div>
      )}
    </div>
  );
}

const DateText = ({date}: { date: string }) => {
  const d = new Date(date);
  return <span>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</span>;
}