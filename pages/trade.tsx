import React, {useEffect, useState} from 'react';
import {Site} from '../components/Site';
import {Title} from '../components/Title';
import {CandidateModal} from '../components/CandidateModal';
import {CandidateList} from '../components/CandidateList';
import {Portfolio} from '../components/Portfolio';
import {isAllowedTime} from '../util/market';

export default function TradePage() {
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [tradingBlock, setTradingBlock] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setTradingBlock(!isAllowedTime()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Site>
      <Portfolio onSelect={id => setActiveCandidate(id)}/>
      <Title>Kandidatinnen</Title>
      {activeCandidate ? (
        <CandidateModal
          onClose={() => setActiveCandidate(null)}
          candidateId={activeCandidate}
        />
      ) : null}
      <div
        className={`p-4 mb-4 rounded pointer-events-none ${tradingBlock ? 'font-bold bg-pohutukawa-300 text-white' : 'italic text-gray-800'}`}>
        Donnerstags von 20:00 - 21:10 Uhr und 21:15 - 23:10 Uhr besteht eine Handelssperre.
      </div>
      <div className={tradingBlock ? 'pointer-events-none' : ''}>
        <CandidateList onCandidate={id => setActiveCandidate(id)}/>
      </div>
    </Site>
  );
}
