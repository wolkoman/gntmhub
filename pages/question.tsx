import React, {useEffect, useState} from 'react';
import {Site} from '../components/Site';
import {Title} from '../components/Title';
import {calculatePrice} from '../util/market';
import {useStore} from '../util/store';
import {fetchJson} from '../util/fetchJson';
import {QuestionEntity} from '../util/DatabaseService';

export default function QuestionPage() {
  const [questions] = useStore(state => [state.questions, state.load()]);
  return (
    <Site>
      <Title>Bonusfragen</Title>
      <div className="flex flex-col justify-center">
        {Object.entries(questions
          .map(q => ({...q, group: q.deadline.substr(0,10)}))
          .reduce((aggregate, current) => {
          aggregate[current.group] = aggregate[current.group] ?? [];
          aggregate[current.group].push(current);
          return aggregate;
        }, {})).sort(([b],[a]) => a.localeCompare(b)).map(([group, questions]: [string, QuestionEntity[]]) => <div key={group}>
          <div className="text-xl font-serif mb-3 mt-6">
            Folge vom {new Date(group).toLocaleDateString("de")}
          </div>
          {questions.map(question => <Question key={question._id} question={question}/>)}
        </div>)}
      </div>
    </Site>
  );
}

function Question({question}: { question: QuestionEntity }) {
  const [user] = useStore(state => [state.user, state.load()]);
  const [selectedOption, setSelectedOption] = useState<number>(null);
  const [answerable, setAnswerable] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => setSelectedOption(question.answers[user._id]), [question, user]);
  useEffect(() => {
    const interval = setInterval(() => setAnswerable(new Date(question.deadline).getTime() > new Date().getTime()), 1000);
    return () => clearInterval(interval);
  });
  const answer = (optionId) => {
    if(!answerable || loading) return;
    setLoading(true);
    fetchJson('/api/market/answer-question', {questionId: question._id, optionId})
      .then(() => setSelectedOption(optionId))
      .finally(() => setLoading(false));
  }
  return (
    <div className={`bg-gray-100 mb-2 p-3 pb-1 rounded ${loading ? "opacity-80": ""}`}>
      <div className="flex flex-row flex-wrap uppercase">
        <div>Pot: {question.pot} gpoints</div>
        <div className="ml-4">Deadline: {new Date(question.deadline).toLocaleString('de-AT')}</div>
      </div>
      <div className="font-serif text-xl font-bold my-2 mb-4">{question.question}</div>
      <div className="flex flex-row flex-wrap my-2">
        {question.options.map((option, optionIndex) =>
          <div key={optionIndex}
               className={`px-4 py-1 border border-gray-400 mx-1  rounded mb-2 
               ${answerable && !loading ? " cursor-pointer" : ""}
               ${optionIndex === selectedOption ? " bg-gray-600 text-white" : ""}
               ${optionIndex === question.correct ? " ring-4 ring-pohutukawa-400" : ""}`}
               onClick={() => answer(optionIndex)}>
            {option}
            {answerable ? null : " ("+(100* Object.values(question.answers).filter(x => x === optionIndex).length / Object.values(question.answers).length).toFixed(0) + "%)"}
          </div>)}
        {loading ? <div className="px-4 py-1">speichert...</div> : null}
      </div>
    </div>
  );
}

