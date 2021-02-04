import React from "react";
import { UserEntity } from "../util/mongo";
import { calculatePrice } from "../util/market";

export default function LeaderBoard({
  users,
  userId,
  stocks,
}: {
  users: UserEntity[];
  userId: string;
  stocks: any;
}) {
  return (
    <div className="flex flex-col justify-center">
      {users.map((user, i) => {
        //todo: load the stocks for all users and not just current one
        let equity = Object.entries(user.stocks).reduce(
          (p, [candidateId, amount]) =>
            p + calculatePrice(stocks, candidateId, amount),
          0
        );
        return (
          <div
            key={user._id}
            className={
              `flex p-2 bg-gray-200 rounded mb-2 border-pohutukawa-200 ` +
              (user._id === userId ? "border" : "")
            }
          >
            <div className="w-20">{i + 1}</div>
            <div className="w-40">{user.name}</div>
            <div className="w-20">{user.points.toFixed(2)}</div>
            <div className="w-20">{equity.toFixed(2)}</div>
            <div className="w-20 font-bold">
              {(equity + user.points).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
