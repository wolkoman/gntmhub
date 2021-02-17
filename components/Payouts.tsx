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
        .map(message => (message as PayoutMessageEntity).payouts)
        .map((payouts, i) => <div>
          <div key={i} className="bg-gray-300 p-3 rounded mb-4 cursor-pointer" onClick={() => setActivePayout(i)}>
            <div>Dividenauszahlung</div>
          </div>
          {activePayout === i ? <Modal disabled={false} onClose={() => setActivePayout(null)}>
            <div className="p-6">
              <div className="font-serif text-3xl mb-6">Dividenauszahlung</div>
              <div className="flex flex-wrap">
                {payouts.sort((a, b) => b.amount - a.amount).map(payout =>
                  <div className="p-1 px-2 m-1 border-gray-300 border rounded">
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
