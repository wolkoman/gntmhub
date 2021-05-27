import {Title} from './Title';
import React from 'react';
import {fetchJson} from '../util/fetchJson';
import {useStore} from '../util/store';
import {ArrayElement, GetDto} from '../pages/api/market/get';

export function Administrator(){
  const [user, questions, candidates] = useStore(state => [state.user, state.questions, state.candidates]);
  const release = () => {
    if(!confirm("Wollen Sie das wirklich tun?")) return;
    fetchJson("/api/admin/payout");
  }
  const tradingBlock = () => {
    const active = !!confirm(`Soll eine spontane Handelssperre aktiviert sein?`);
    fetchJson("/api/admin/tradingBlock", {active});
  }
  const push = () => {
    fetchJson("/api/admin/push");
  }
  const sendBulk = () => {
    let message = prompt("Welche Nachricht wollen Sie senden?");
    if(message.length === 0) return;
    if(!confirm(`Wollen Sie die Nachricht "${message}" (${message.length} Zeichen) senden?`)) return;
    fetchJson("/api/admin/info", {message});
  }
  const money = () => {
    let money = +prompt("Wieviel Geld wollen Sie auszahlen");
    if(money === 0) return;
    if(!confirm(`Wollen Sie wirklich ${money} gpoints senden?`)) return;
    fetchJson("/api/admin/money", {money});
  }
  const answer = (question: ArrayElement<GetDto['questions']>) => () => {
    let optionId = +prompt(question.options.map((o, i) => `${i}. ${o}`).join("\n"));
    if(optionId === -1) return;
    if(!confirm(`Wollen Sie wirklich ${question.options[optionId]} als richtig auswählen?`)) return;
    fetchJson("/api/admin/answer-question", {optionId, questionId: question._id});
  }
  const kick = () => {
    let optionId = +prompt(candidates.filter(c => !c.terminated).map((o, i) => `${i}. ${o.name}`).join("\n"));
    if(optionId === -1) return;
    const candidate = candidates.filter(c => !c.terminated)[optionId];
    if(!confirm(`Wollen Sie wirklich ${candidate.name} ausscheiden lassen?`)) return;
    fetchJson("/api/admin/kick", {candidateId: candidate._id});
  }
  return user?.admin ? <div>
    <Title>Administrator</Title>
    <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={tradingBlock}>Spontane Handelssperre</button>
    <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={release}>Dividenden ausschütten</button>
    <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={sendBulk}>Nachricht schicken</button>
    <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={money}>Geld ausschütten</button>
    <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={kick}>Kandidatin ausscheiden</button>
    <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={push}>Push</button>
    {questions.filter(q => q.correct === null).map(question => <div key={question._id}>
      <button className="bg-gray-500 p-2 m-2 text-white rounded" onClick={answer(question)}>{question.question} beantworten</button>
    </div>)}
  </div> : null;
}