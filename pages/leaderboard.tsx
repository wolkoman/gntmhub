import React from "react";
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { calculatePrice } from "../util/market";
import { useStore } from "../util/store";

export default function LeaderboardPage() {
  const [store] = useStore(state => [state, state.load()]);
  return (
    <Site>
      <Title>Rangliste</Title>
      <div className="flex flex-col justify-center">
        <div className={`flex p-2 italic rounded mb-2 text-gray-400 `}>
          <div className="w-20 font-bold text-center">#</div>
          <div className="w-40">Name</div>
          <div className="w-20 font-bold">Gesamtwert</div>
        </div>
        {store.users
          .map(user => ({
            ...user,
            equity: Object.entries(user.stocks).reduce(
              (p, [candidateId, amount]) =>
                p +
                -calculatePrice(store.stocks, candidateId, -amount) *
                  (store.candidates.find(
                    candidate => candidate._id === candidateId
                  ).terminated
                    ? 0
                    : 1),
              0
            ),
          }))
          .sort((a, b) => b.equity + b.points - a.equity - a.points)
          .map((user, i) => (
            <div
              key={user._id}
              className={
                `flex p-2 rounded mb-2 ` +
                (user._id === store.user._id
                  ? "font-bold border border-pohutukawa-50"
                  : "")
              }
            >
              <div className="w-20 font-bold text-center">{i + 1}</div>
              <div className="w-40">{user.name}</div>
              <div className="w-20 font-bold">
                {(user.equity + user.points).toFixed(2)}
              </div>
            </div>
          ))}
      </div>
    </Site>
  );
}
