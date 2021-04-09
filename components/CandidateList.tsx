import {calculatePrice} from '../util/market';
import {useStore} from '../util/store';

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
    <div className="flex flex-wrap mx-auto justify-between">
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
            className="w-28 h-28 md:w-40 md:h-40 rounded md:m-2 m-1 flex flex-col bg-gray-200 overflow-hidden"
            style={{
              cursor: candidate.terminated ? 'default' : 'pointer',
              filter: candidate.terminated ? 'grayscale(1) contrast(75%)' : '',
              opacity: candidate.terminated ? 0.7 : 1,
              backgroundImage: `url(${candidate.imageUrl})`,
              backgroundSize: 'cover',
            }}
            onClick={() => candidate.terminated ? null : onCandidate(candidate._id)}
          >
            <div className="h-full"/>
            <div className="flex flex-row justify-between items-center px-2 py-1" style={{background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)'}}>
              <div className={candidate.terminated ? 'line-through' : ''}>
                {candidate.name}
              </div>
              <div className={'text-xl text-right font-bold ' + (candidate.terminated ? 'hidden' : '')}>
                {candidate.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
