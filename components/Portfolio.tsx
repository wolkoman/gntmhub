import {useStore} from '../util/store';
import {useState} from 'react';
import {CandidateEntity} from '../util/DatabaseService';

export function Portfolio({onSelect}: { onSelect: (id: string) => any }) {
  const [candidates, user] = useStore(state => [state.candidates, state.user]);
  const [expanded, setExpanded] = useState(false);
  return <div>
    <div style={{maxHeight: expanded ? 2000 : 190}} className="overflow-hidden transition-all duration-1000">{
      (Object.entries(user?.stocks ?? {}))
        .filter(([, amount]) => amount)
        .sort((a, b) => b[1] - a[1])
        .map(([candidateId, amount]) => ({candidate: candidates.find(candidate => candidate._id === candidateId) as CandidateEntity, amount}))
        .filter(({candidate}) => !candidate.terminated)
        .map(({candidate, amount}) => {
          return <div key={candidate._id} className="flex items-center cursor-pointer rounded mb-2"
                      onClick={() => onSelect(candidate._id)}>
            <div className="text-lg p-3 pr-4 w-20 text-2xl font-bold text-right">{amount}</div>
            <div style={{backgroundImage: `url(${candidate.imageUrl})`, backgroundSize: 'cover'}}
                 className="w-14 h-14"/>
            <div className="text-lg p-2 pl-6">{candidate.name}</div>
          </div>;
        })}
    </div>
    <div className="flex justify-center">
      <div
        className="flex justify-center items-center text-white rounded-3xl w-10 h-10 bg-pohutukawa-400 cursor-pointer"
        onClick={() => setExpanded(f => !f)}>
          <div
            className="border-b-2 border-r-2 border-white w-3 h-3 transform -mt-1 transition-all duration-1000"
            style={{ transform: `rotate(${expanded ? 225 : 45}deg)`, marginTop: expanded ? 4 : -4}}
          />
      </div>
    </div>
  </div>;
}
