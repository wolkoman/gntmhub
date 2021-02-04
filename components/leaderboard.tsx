import React from "react";
import { CandidateEntity, UserEntity } from "../util/mongo";
import { calculatePrice } from "../util/market";

export default function LeaderBoard({
  users,
  userId,
  stocks,
  candidates,
}: {
  users: UserEntity[];
  userId: string;
  stocks: any;
  candidates: CandidateEntity[];
}) {
  return (
    <div className="flex flex-col justify-center">
      <div className={`flex p-2 italic rounded mb-2 text-gray-400 `}>
        <div className="w-20 font-bold text-center">#</div>
        <div className="w-40">Name</div>
        <div className="w-20">Cash</div>
        <div className="w-20">Aktien</div>
        <div className="w-20 font-bold">Gesamtwert</div>
      </div>
      {users
        .map(user => ({
          ...user,
          equity: Object.entries(user.stocks).reduce(
            (p, [candidateId, amount]) =>
              p +
              -calculatePrice(stocks, candidateId, -amount) *
                (candidates.find(candidate => candidate._id === candidateId)
                  .terminated
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
              (user._id === userId
                ? "font-bold border border-pohutukawa-50"
                : "")
            }
          >
            <div className="w-20 font-bold text-center">{i + 1}</div>
            <div className="w-40">{user.name}</div>
            <div className="w-20">{user.points.toFixed(2)}</div>
            <div className="w-20">{user.equity.toFixed(2)}</div>
            <div className="w-20 font-bold">
              {(user.equity + user.points).toFixed(2)}
            </div>
          </div>
        ))}
    </div>
  );
}
