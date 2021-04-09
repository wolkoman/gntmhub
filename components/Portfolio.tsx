import {useStore} from '../util/store';
import React, {useEffect, useState} from 'react';
import {CandidateEntity} from '../util/DatabaseService';
import {Title} from './Title';

export function Portfolio({onSelect}: { onSelect: (id: string) => any }) {
  const [allCandidates, user] = useStore(state => [state.candidates, state.user]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    setCandidates(Object.entries(user?.stocks ?? {})
      .filter(([, amount]) => amount)
      .sort((a, b) => b[1] - a[1])
      .map(([candidateId, amount]) => ({
        candidate: allCandidates.find(candidate => candidate._id === candidateId) as CandidateEntity,
        amount
      }))
      .filter(({candidate}) => !candidate.terminated)
    );
  }, [user, allCandidates]);

  return candidates.length === 0 ? <></> :
    <div>
      <div className="text-2xl font-serif mb-4">Portfolio</div>
      <div className="overflow-hidden flex flex-wrap flex-row lg:flex-col lg:w-40">{
        candidates.map(({candidate, amount}) =>
          <div key={candidate._id}
               className="flex items-center cursor-pointer mb-2 w-1/3 lg:w-full"
               onClick={() => onSelect(candidate._id)}
          >
            <div className="text-xl w-10 text-center flex-grow-0 p-2 bg-gray-200 rounded h-full">{amount}</div>
            <div className="text-lg p-2 font-serif">{candidate.name}</div>
          </div>)}
      </div>
    </div>;
}
