import React from 'react';
import {Site} from '../components/Site';
import {useStore} from '../util/store';

export default function LeaderboardPage() {
  const [users] = useStore(state => [state.users, state.load()]);
  return (
    <Site>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col justify-center">
          {users[0] ? <div
            className="flex w-full p-6 rounded bg-gray-600 text-white mb-2 text-2xl items-center transform lg:scale-110">
            <div className="w-12 font-bold text-center text-4xl">1</div>
            <div className="flex-grow">{users[0].name}</div>
            <div className="w-20 font-bold text-right">{users[0].total.toFixed(0)}</div>
          </div> : null}
          <div className="grid grid-cols-2 gap-2">
            {users[1] ? <div
              className="flex w-full p-4 rounded self-center bg-gray-300 items-center text-lg transform lg:scale-105 lg:-ml-3 my-1">
              <div className="w-8 font-bold text-center text-xl">2</div>
              <div className="flex-grow">{users[1].name}</div>
              <div className="w-20 font-bold text-right">{users[1].total.toFixed(0)}</div>
            </div> : null}
            {users[2] ? <div
              className="flex w-full p-4 rounded self-center bg-gray-300 items-center text-lg transform lg:scale-105 lg:ml-3 my-1">
              <div className="w-8 font-bold text-center text-xl">3</div>
              <div className="flex-grow">{users[2].name}</div>
              <div className="w-20 font-bold text-right">{users[2].total.toFixed(0)}</div>
            </div> : null}
            {users.slice(3).map((user, i) => (
              <div key={user.name} className="flex p-3 rounded justify-center bg-gray-100">
                <div className="w-8 font-bold text-center">{i + 4}</div>
                <div className="flex-grow">{user.name}</div>
                <div className="w-20 font-bold text-right">{user.total.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Site>
  );
}
