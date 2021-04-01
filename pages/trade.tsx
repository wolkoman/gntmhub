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
  const tradingBlockNotice = "Donnerstags von 20:15 - 21:00 Uhr und 21:05 - 22:50 Uhr besteht eine Handelssperre.";

  const updateTrading = () => setTradingBlock(!isAllowedTime());

  useEffect(() => {
    updateTrading();
    const interval = setInterval(updateTrading, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Site>
      {tradingBlock ? <><div className="text-5xl font-serif my-36">
        🙁 Zurzeit besteht eine Handelssperre!
        <div className="text-lg mt-6">{tradingBlockNotice}</div>
      </div></> : <>
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
        {tradingBlockNotice}
      </div>
      <div className={tradingBlock ? 'pointer-events-none' : ''}>
        <CandidateList onCandidate={id => setActiveCandidate(id)}/>
      </div>
      </>}
    </Site>
  );
}
