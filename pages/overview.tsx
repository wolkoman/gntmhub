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
      <Administrator/>
    </Site>
  );
}
