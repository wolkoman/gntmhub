import React, {useState} from 'react';
import {Site} from '../components/Site';
import {CandidateModal} from '../components/CandidateModal';
import {CandidateList} from '../components/CandidateList';
import {Portfolio} from '../components/Portfolio';
import {useStore} from '../util/store';
import {Administrator} from '../components/Administrator';
import FeatherIcon from 'feather-icons-react';
import {Line} from 'react-chartjs-2';
import {Title} from '../components/Title';

export default function TradePage() {
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [tradingBlocks, user, users] = useStore(state => [state.tradingBlocks, state.user, state.users]);
  const blockActive = tradingBlocks.some(block => new Date(block.start).getTime() < new Date().getTime() && new Date(block.end).getTime() > new Date().getTime())

  return (
    <Site>
      <div className="flex flex-row mb-4">
        <div className="flex flex-col md:flex-row justify-end flex-grow dark:text-gray-200">
          <div
            className="bg-gray-100 dark:bg-gray-800 px-8 py-2 rounded mb-2 md:mb-0 mr-2 flex-grow flex items-center lg:text-lg">
            Punktestand: {user?.points.toFixed(2)} gp
          </div>
          { tradingBlocks.length === 0 ? null :
              <div
            className={`px-8 py-2 rounded mr-2 flex-grow flex items-center lg:text-lg ${blockActive ? 'bg-pohutukawa-400 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {blockActive ? 'Aktuelle' : 'Nächste'} Handelssperre: <DateToday span={tradingBlocks[0]}/> Uhr
          </div>}
        </div>
        <div className="flex flex-col justify-center items-center bg-gray-400 dark:bg-gray-800 text-white px-8 py-2 rounded">
          <div className="font-bold text-5xl flex items-center">
            <FeatherIcon icon="hash" size={30}/>
            {users.findIndex(u => u.name === user.name) + 1}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <Portfolio onSelect={id => setActiveCandidate(id)}/>
        <div>
          <div className="text-2xl font-serif mb-4 mt-8 lg:hidden">Kandidatinnen</div>
          <CandidateList onCandidate={id => setActiveCandidate(id)}/>
        </div>
      </div>
      <div>
        <Title>Aktienhistorie</Title>
        <StockHistory/>
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

const StockHistory = () => {
  const [stockRecords, candidates] = useStore(state => [state.stockRecords, state.candidates]);
  return <>
    <Line
      data={{
        labels: stockRecords.map(record => new Date(record.timestamp)).map(date => `${date.getDate()}.${date.getMonth()} ${date.getHours()}'`),
        datasets: candidates.map((candidate, index) => ({
          label: candidate.name,
          data: stockRecords.map(record => record.stocks[candidate._id]),
          borderColor: Array(10).fill(['#D4AD9E', '#B9B6B5', '#52382F', '#B78570', '#905A4D', '#191814',]).flat()[index],
          fillColor: Array(2).fill(['#D4AD9E', '#B9B6B5', '#52382F', '#B78570', '#905A4D', '#191814',]).flat()[index],
          fill: false,
          tension: 0.25,

        }))
      }}
      legend={{display: false}}
      options={{datasets: {line: {borderWidth: 4}}, elements: {point: {radius: 1}}}}
    />
  </>;
};

const DateSpan = ({start, end}: { start: Date, end: Date }) => {
  const sameDate = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate();
  return <>
    <DateFormat date={start} type="DATE"/> <DateFormat date={start} type="TIME"/> - {' '}
    {sameDate ? '' : <DateFormat date={end} type="DATE"/>} <DateFormat date={end} type="TIME"/>
  </>;
}
const DateToday = ({span}: { span: { start: Date, end: Date } }) => {
  const date = new Date(span.start);
  const isToday = date.toLocaleDateString() === new Date().toLocaleDateString();
  return isToday
    ? <><DateFormat date={date} type="TIME"/> - <DateFormat date={new Date(span.end)} type="TIME"/></>
    : <><DateFormat date={date} type="DATE"/> <DateFormat date={date} type="TIME"/></>;
}
const DateFormat = ({date, type}: { date: Date, type: 'DATE' | 'TIME' }) => {
  const pad = str => `${Array(2 - str.toString().length).fill(0).join('')}${str}`
  return type === 'DATE'
    ? <>{`${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`}</>
    : <>{`${pad(date.getHours())}:${pad(date.getMinutes())}`}</>;
}