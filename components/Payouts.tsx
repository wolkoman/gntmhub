import React, {useState} from 'react';
import {useStore} from '../util/store';
import {PayoutMessageEntity} from '../util/DatabaseService';
import {Modal} from './Modal';

export default function Payouts() {
  const [candidates, messages] = useStore(state => [
    state.candidates, state.messages, state.loadMessages(), state.load()
  ]);
  const [activePayout, setActivePayout] = useState<number>();
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {messages
        .filter(message => message.type === "PAYOUT")
        .map(message => (message as PayoutMessageEntity))
        .map((message, i) => <div key={i}>
          <div className="bg-gray-300 p-3 rounded mb-4 cursor-pointer flex justify-between" onClick={() => setActivePayout(i)}>
            <div>Dividenauszahlung vom <DateText date={message.date}/></div>
            <div className="font-bold">{message.payouts.map(payout => payout.amount).reduce((a,b) => a+b, 0).toFixed(2)} gp</div>
          </div>
          {activePayout === i ? <Modal disabled={false} onClose={() => setActivePayout(null)}>
            <div className="p-6">
              <div className="font-serif text-3xl mb-6">Dividenauszahlung</div>
              <div className="flex flex-wrap">
                {message.payouts.sort((a, b) => b.amount - a.amount).map((payout,i) =>
                  <div key={i} className="p-1 px-2 m-1 border-gray-300 border rounded">
                    {candidates.find(candidate => candidate._id === payout.candidateId)?.name}: {payout.amount.toFixed(2)} gp
                  </div>
                )}
              </div>
            </div>
          </Modal> : null}
        </div>)}
    </div>
  );
}

const DateText = ({date}: {date:string}) => {
  const d = new Date(date);
  return <span>{d.getDate()}.{d.getMonth()+1}.{d.getFullYear()}</span>;
}