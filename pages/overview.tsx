import React, {useEffect, useState} from 'react';
import {Site} from '../components/Site';
import {Title} from '../components/Title';
import {useStore} from '../util/store';
import {calculatePrice} from '../util/market';
import {Administrator} from '../components/Administrator';
import {PayoutMessageEntity} from '../util/DatabaseService';
import {GPoints} from '../components/GPoints';

export default function Overview() {
  const [user, stocks, candidates, messages] = useStore(state => [
    state.user, state.stocks, state.candidates, state.messages, state.loadMessages(), state.load()
  ]);
  const [equity, setEquity] = useState(0);
  useEffect(() => {
    setEquity(Object.entries(user?.stocks ?? {}).reduce(
      (p, [candidateId, amount]) =>
        p +
        -calculatePrice(stocks, candidateId, -amount) *
        (candidates.find(
          candidate => candidate._id === candidateId
        ).terminated
          ? 0
          : 1),
      0
    ));
  }, [user]);
  return (
    <Site>
      <Title>Punkteübersicht</Title>
      <div className="bg-gradient-to-r from-pohutukawa-300 to-pohutukawa-100 rounded p-6 flex flex-col md:flex-row">
        <div className="mr-8">
          <div className="font-bold text-white uppercase">
            Aktuelle GPoints
          </div>
          <div className="text-white text-6xl">
            {(user?.points + equity).toFixed(2)}
          </div>
        </div>
        <div className="flex flex-wrap mt-8 md:mt-0">
          <div className="bg-white rounded p-4 mr-8">
            <div className="text-sm font-bold uppercase">
              Liquidität
            </div>
            <div className="text-4xl">
              {user?.points.toFixed(2)}
            </div>
          </div>
          <div className="bg-white rounded p-4">
            <div className="text-sm font-bold uppercase">
              Aktienwert
            </div>
            <div className="text-4xl">
              {equity?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <Title>Auszahlungen</Title>
      <div>
        {messages
          .map(message => (message as PayoutMessageEntity).payouts)
          .map((payouts, i) => <div key={i} className="bg-gray-300 p-3 rounded mb-4">
          <div>Dividenauszahlung</div>
          <div className="flex flex-wrap">
            {payouts.sort((a,b) => b.amount - a.amount).map(payout => <div className="p-1 px-2 m-1 bg-white rounded">
              {candidates.find(candidate => candidate._id === payout.candidateId)?.name}: {payout.amount.toFixed(2)} gp
            </div>)}
          </div>
        </div>)}
      </div>
      {user?.admin ? <Administrator/> : null}
    </Site>
  );
}
