import React, {useEffect, useState} from 'react';
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { CandidateModal } from "../components/CandidateModal";
import { CandidateList } from "../components/CandidateList";
import { Portfolio } from '../components/Portfolio';
import {isAllowedTime} from '../util/market';
import Overview from '../components/Overview';
import {Administrator} from '../components/Administrator';
import Payouts from '../components/Payouts';

export default function Home() {
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [tradingBlock, setTradingBlock] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setTradingBlock(!isAllowedTime()), 1000);
    return () => clearInterval(interval);
  },[]);
  return (
    <Site>
      <Overview/>
      <Portfolio onSelect={id => setActiveCandidate(id)}/>
      <Title>Kandidatinnen</Title>
      {activeCandidate ? (
        <CandidateModal
          onClose={() => setActiveCandidate(null)}
          candidateId={activeCandidate}
        />
      ) : null}
      <div className={`p-4 mb-4 rounded pointer-events-none ${tradingBlock ? "font-bold bg-pohutukawa-300 text-white" : "italic text-gray-800"}`}>
        Donnerstags von 20:00 - 21:00 Uhr und 21:15 - 22:45 Uhr besteht eine Handelssperre.
      </div>
      <div className={tradingBlock ? "pointer-events-none" : ""}>
        <CandidateList onCandidate={id => setActiveCandidate(id)} />
      </div>
      <Administrator/>
    </Site>
  );
}
