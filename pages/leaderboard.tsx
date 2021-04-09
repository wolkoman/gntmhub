import React, {useEffect, useState} from 'react';
import {Site} from '../components/Site';
import {Title} from '../components/Title';
import {calculatePrice} from '../util/market';
import {useStore} from '../util/store';

export default function LeaderboardPage() {
  const [users, myUser] = useStore(state => [state.users, state.user, state.load()]);
  return (
    <Site>
      <Title>Rangliste</Title>
      <div className="flex flex-col justify-center">
        <div className={`flex p-2 rounded mb-2 text-gray-400 `}>
          <div className="w-20 font-bold text-center">#</div>
          <div className="w-40">Name</div>
          <div className="w-20 font-bold">Gesamtwert</div>
        </div>
        {users.map((user, i) => (
          <div
            key={user.name}
            className={
              `flex p-2 rounded mb-2 ` +
              (user.name === myUser.name
                ? 'font-bold bg-pohutukawa-400 text-white'
                : '')
            }
          >
            <div className="w-20 font-bold text-center">{i + 1}</div>
            <div className="w-40">{user.name}</div>
            <div className="w-20 font-bold">
              {user.total.toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </Site>
  );
}
