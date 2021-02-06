import { calculatePrice } from "../util/market";
import { useStore } from "../util/store";

export function CandidateList({
  onCandidate,
}: {
  onCandidate: (candidateId: string) => any;
}) {
  const [candidates, stocks] = useStore(state => [
    state.candidates,
    state.stocks,
    state.load(),
  ]);
  return (
    <div className="flex flex-wrap mx-auto">
      {candidates
        .map(candidate => ({
          ...candidate,
          price: calculatePrice(stocks, candidate._id, 1),
        }))
        .sort((a, b) => b.price - a.price)
        .sort((a, b) => (a.terminated ? 1 : 0) - (b.terminated ? 1 : 0))
        .map(candidate => (
          <div
            key={candidate._id}
            className="w-28 h-28 md:w-36 md:h-36 rounded md:m-2 m-1 flex flex-col justify-between z-0"
            style={{
              cursor: candidate.terminated ? "default" : "pointer",
              backgroundImage: `url(${candidate.imageUrl})`,
              filter: candidate.terminated ? "grayscale(1)" : "",
              opacity: candidate.terminated ? 0.7 : 1,
              backgroundSize: "cover",
            }}
            onClick={() =>
              candidate.terminated ? null : onCandidate(candidate._id)
            }
          >
            <div
              className={
                "p-1 text-white" + (candidate.terminated ? " line-through" : "")
              }
            >
              {candidate.name}
            </div>
            <div
              className={
                "font-serif text-5xl text-white text-right m-1" +
                (candidate.terminated ? " hidden" : "")
              }
            >
              {candidate.price.toFixed(2)}
            </div>
          </div>
        ))}
    </div>
  );
}
