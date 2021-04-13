import React, {useEffect, useState} from 'react';
import {Site} from '../components/Site';
import {State, useStore} from '../util/store';
import {fetchJson} from '../util/fetchJson';
import {ArrayElement, GetDto} from './api/market/get';

export default function QuestionPage() {
  const [questions]: [State['questions'], null] = useStore(state => [state.questions, state.load()]);
  return (
    <Site>
      <div className="flex flex-col justify-center">
        {Object.entries(questions
          .map(q => ({...q, group: q.deadline.substr(0, 10)}))
          .reduce((aggregate, current) => {
            aggregate[current.group] = aggregate[current.group] ?? [];
            aggregate[current.group].push(current);
            return aggregate;
          }, {})).sort(([b], [a]) => a.localeCompare(b)).map(([group, questions]: [string, State['questions']], i: number) =>
          <div key={group} className="flex flex-col lg:flex-row mb-8">
            <div className="text-xl mb-3 mt-6 w-56 flex-shrink-0 flex lg:block">
              <div className="lg:font-serif mr-2">Folge vom</div>
              <div className="lg:text-4xl">{new Date(group).toLocaleDateString('de')}</div>
            </div>
            <div className="flex flex-col w-full">
              {questions.map(question => <Question key={question._id} question={question} highlight={i === 0}/>)}
            </div>
          </div>
        )}
      </div>
    </Site>
  );
}

function Question({question, highlight}: { question: ArrayElement<GetDto['questions']>, highlight: boolean }) {
  const [user, setAnswerInStore] = useStore(state => [state.user, state.setAnswer, state.load()]);
  const [selectedOption, setSelectedOption] = useState<number>(null);
  const [answerable, setAnswerable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => setSelectedOption(question.answer), [question, user]);
  useEffect(() => {
    const update = () => setAnswerable(new Date(question.deadline).getTime() > new Date().getTime());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  });
  const answer = (optionId) => {
    if (!answerable || loading) return;
    setLoading(true);
    fetchJson('/api/market/answer-question', {questionId: question._id, optionId})
      .then(() => {
        setSelectedOption(optionId);
        setAnswerInStore(question._id, optionId);
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className={`mb-2 p-3 pb-1 rounded ${loading ? 'opacity-80' : ''} bg-gray-100`}>
      <div className="flex flex-row flex-wrap uppercase">
        <div>Pot: {question.pot} gpoints</div>
        <div className="ml-4">Deadline: {new Date(question.deadline).toLocaleString('de-AT')}</div>
      </div>
      <div className="font-serif text-xl font-bold my-2 mb-4">{question.question}</div>
      <div className="flex flex-row flex-wrap my-2">
        {question.options.map((option, optionIndex) =>
          <div key={optionIndex}
               className={`px-4 py-1 border border-gray-400 mx-1  rounded mb-2 
               ${answerable && !loading ? ' cursor-pointer' : ''}
               ${optionIndex === selectedOption ? ' ring ring-gray-400' : ''}
               ${optionIndex === question.correct ? ' bg-green-600 text-white' : ''}`}
               onClick={() => answer(optionIndex)}>
            {option}
          </div>)}
        {loading ? <div className="px-4 py-1">speichert...</div> : null}
      </div>
    </div>
  );
}

