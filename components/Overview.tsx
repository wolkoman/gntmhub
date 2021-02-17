import React, {useEffect, useState} from 'react';
import {Title} from '../components/Title';
import {useStore} from '../util/store';
import {calculatePrice} from '../util/market';
import Payouts from './Payouts';

export default function Overview() {
  const [user, stocks, candidates] = useStore(state => [
    state.user, state.stocks, state.candidates, state.messages, state.load()
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
    <div>
      <Title>Punkteübersicht</Title>
      <div
        className="bg-gradient-to-r from-pohutukawa-300 to-pohutukawa-100 rounded p-6 mb-3 flex flex-col md:flex-row">
        <div className="mr-8">
          <div className="font-bold text-white uppercase">Aktuelle GPoints</div>
          <div className="text-white text-6xl">{(user?.points + equity).toFixed(2)}</div>
        </div>
        <div className="flex flex-wrap mt-8 md:mt-0">
          <div className="bg-white rounded p-4 mr-8">
            <div className="text-sm font-bold uppercase">Liquidität</div>
            <div className="text-4xl">{user?.points.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded p-4">
            <div className="text-sm font-bold uppercase">Aktienwert</div>
            <div className="text-4xl">{equity?.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <Payouts/>
    </div>
  );
}
