import React, {useState} from 'react';
import {Site} from '../components/Site';
import {Title} from '../components/Title';
import {CandidateModal} from '../components/CandidateModal';
import {CandidateList} from '../components/CandidateList';
import {Portfolio} from '../components/Portfolio';
import {useStore} from '../util/store';
import {GetDto} from './api/market/get';

export default function TradePage() {
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const tradingBlocks = useStore(state => state.tradingBlocks)

  return (
    <Site>
      <div className="flex flex-col lg:flex-row">
        <Portfolio onSelect={id => setActiveCandidate(id)}/>
        <div>
          <div className="text-2xl font-serif mb-4 mt-8 lg:hidden">Kandidatinnen</div>
          <CandidateList onCandidate={id => setActiveCandidate(id)}/>
        </div>
      </div>
      <Title>Handelssperren</Title>
      <div>
        {tradingBlocks.map(tradingBlock => <div>
          <DateSpan start={new Date(tradingBlock.start)} end={new Date(tradingBlock.end)}/>
        </div>)}
      </div>

      {activeCandidate ? (
        <CandidateModal
          onClose={() => setActiveCandidate(null)}
          candidateId={activeCandidate}
        />
      ) : null}
    </Site>
  );
}

const DateSpan = ({start, end}: {start: Date, end: Date}) =>{
  const sameDate = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate();
  return <>
    <DateFormat date={start} type="DATE"/> <DateFormat date={start} type="TIME"/> - {" "}
    {sameDate?'':<DateFormat date={end} type="DATE"/>} <DateFormat date={end} type="TIME"/>
  </>;
}
const DateFormat = ({date, type}: {date: Date, type: 'DATE'|'TIME'}) =>{
  const pad = str => `${Array(2 - str.toString().length).fill(0).join('')}${str}`
  return type === 'DATE'
    ? <>{`${pad(date.getDate())}.${pad(date.getMonth()+1)}.${date.getFullYear()}`}</>
    : <>{`${pad(date.getHours())}:${pad(date.getMinutes())}`}</>;
}