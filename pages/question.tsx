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
        {questions.map(question => <Question key={question._id} question={question}/>)}
      </div>
    </Site>
  );
}

function Question({question}: { question: QuestionEntity }) {
  const [user] = useStore(state => [state.user, state.load()]);
  const [selectedOption, setSelectedOption] = useState<number>(null);
  useEffect(() => setSelectedOption(question.answers[user._id]), [question, user]);
  const answer = (optionId) => {
    if(new Date(question.deadline).getTime() < new Date().getTime()) return;
    fetchJson('/api/market/answer-question', {questionId: question._id, optionId});
    setSelectedOption(optionId);
  }
  return (
    <div className="bg-gray-100 mb-6 p-3 pb-1 rounded">
      <div className="flex flex-row flex-wrap uppercase">
        <div>Pot: {question.pot} gpoints</div>
        <div className="ml-4">Deadline: {new Date(question.deadline).toLocaleString('de-AT')}</div>
      </div>
      <div className="font-serif text-xl font-bold my-2 mb-4">{question.question}</div>
      <div className="flex flex-row flex-wrap my-2">
        {question.options.map((option, optionIndex) =>
          <div key={optionIndex}
               className={`px-4 py-1 border border-gray-400 mx-1 cursor-pointer rounded mb-2 ${optionIndex === selectedOption ? "bg-gray-600 text-white" : ""} ${optionIndex === question.correct ? "ring-4 ring-pohutukawa-400" : ""}`}
               onClick={() => answer(optionIndex)}>
            {option}
          </div>)}
      </div>
    </div>
  );
}

