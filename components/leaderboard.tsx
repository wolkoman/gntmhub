import React from "react";
import { CandidateEntity, UserEntity } from "../util/mongo";
import { calculatePrice } from "../util/market";

export default function LeaderBoard({
  users,
  candidates,
  stocks,
}: {
  users: UserEntity[];
  candidates: CandidateEntity[];
  stocks: any;
}) {
  return (
    <div className="flex flex-wrap justify-center mt-20">
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Cash</th>
            <th>Equity</th>
            <th>Total</th>
          </tr>
          {users.map(user => {
            //todo: load the stocks for all users and not just current one
            let equity = candidates.reduce(
              (p, candidate) =>
                p +
                calculatePrice(stocks, candidate._id, stocks[candidate._id]),
              0
            );
            return (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.points}</td>
                <td>{equity}</td>
                <td>{equity + user.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
