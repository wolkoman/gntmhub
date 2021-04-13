import React, {useState} from 'react';
import {Site} from '../components/Site';
import {Title} from '../components/Title';
import {CandidateModal} from '../components/CandidateModal';
import {CandidateList} from '../components/CandidateList';
import {Portfolio} from '../components/Portfolio';
import {useStore} from '../util/store';
import {Administrator} from '../components/Administrator';

export default function TradePage() {
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [tradingBlocks, user, users] = useStore(state => [state.tradingBlocks, state.user, state.users]);
  const blockActive = tradingBlocks.some(block => new Date(block.start).getTime() < new Date().getTime() && new Date(block.end).getTime() > new Date().getTime())

  return (
    <Site>
      <div className="flex flex-row mb-4">
        <div className="flex flex-col md:flex-row justify-end flex-grow">
          <div className="bg-gray-100 px-8 py-2 rounded mb-2 md:mb-0 mr-2 flex-grow flex items-center">
            <div className="text-lg">Aktueller Kontostand: {user?.points.toFixed(2)} gp</div>
          </div>
          <div
            className={`px-8 py-2 rounded mr-2 flex-grow flex items-center ${blockActive ? 'bg-pohutukawa-400 text-white' : 'bg-gray-100'}`}>
            <div className="text-lg">Nächste Handelssperre: {tradingBlocks.length === 0 ? 'keine' :
              <><DateToday date={new Date(tradingBlocks[0].start)}/> Uhr</>
            }</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-gray-600 text-white px-8 py-2 rounded">
          <div className="font-bold text-5xl">#{users.findIndex(u => u.name === user.name) + 1}</div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <Portfolio onSelect={id => setActiveCandidate(id)}/>
        <div>
          <div className="text-2xl font-serif mb-4 mt-8 lg:hidden">Kandidatinnen</div>
          <CandidateList onCandidate={id => setActiveCandidate(id)}/>
        </div>
      </div>
      <Title>Handelssperren</Title>
      <div>
        {tradingBlocks.map(tradingBlock => <div key={tradingBlock.start.toString()}>
          <DateSpan start={new Date(tradingBlock.start)} end={new Date(tradingBlock.end)}/>
        </div>)}
      </div>
      <Administrator/>

      {activeCandidate ? (
        <CandidateModal
          onClose={() => setActiveCandidate(null)}
          candidateId={activeCandidate}
        />
      ) : null}
    </Site>
  );
}

const DateSpan = ({start, end}: { start: Date, end: Date }) => {
  const sameDate = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate();
  return <>
    <DateFormat date={start} type="DATE"/> <DateFormat date={start} type="TIME"/> - {' '}
    {sameDate ? '' : <DateFormat date={end} type="DATE"/>} <DateFormat date={end} type="TIME"/>
  </>;
}
const DateToday = ({date}: { date: Date }) => {
  const isToday = date.toLocaleDateString() === new Date().toLocaleDateString();
  return isToday
    ? <DateFormat date={date} type="TIME"/>
    : <><DateFormat date={date} type="DATE"/> <DateFormat date={date} type="TIME"/></>;
}
const DateFormat = ({date, type}: { date: Date, type: 'DATE' | 'TIME' }) => {
  const pad = str => `${Array(2 - str.toString().length).fill(0).join('')}${str}`
  return type === 'DATE'
    ? <>{`${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`}</>
    : <>{`${pad(date.getHours())}:${pad(date.getMinutes())}`}</>;
}