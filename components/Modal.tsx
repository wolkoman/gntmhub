import { CandidateEntity, UserEntity } from "../util/mongo";

export function Modal({
  candidate,
  user,
  stocks,
  onClose,
}: {
  candidate: CandidateEntity;
  user: UserEntity;
  stocks: any;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-50 bg-white"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div>{candidate.name}</div>
        <img src={candidate.imageUrl} />
        <div>Deine Aktien: {user.stocks[candidate._id]}</div>
        <div>Alle Aktien: {stocks[candidate._id]}</div>
      </div>
    </div>
  );
}
