import { CandidateEntity, UserEntity } from "../util/mongo";

export function Modal({
  candidate,
  user,
  stocks,
}: {
  candidate: CandidateEntity;
  user: UserEntity;
  stocks: any;
}) {
  return (
    <div>
      <div>{candidate.name}</div>
      <img src={candidate.imageUrl} />
      <div>Deine Aktien: {user.stocks[candidate._id]}</div>
      <div>
        Alle Aktien: {stocks.find(stock => stock._id === candidate._id).total}
      </div>
    </div>
  );
}
