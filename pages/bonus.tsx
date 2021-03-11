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
    <>
      <div className="flex flex-row flex-wrap">
        <div className="opacity-80 uppercase">Pot: {question.pot} gpoints</div>
        <div
          className="opacity-80 uppercase ml-4">Deadline: {new Date(question.deadline).toLocaleString('de-AT')}</div>
      </div>
      <div className="font-serif text-xl">{question.question}</div>
      <div className="flex flex-row flex-wrap my-2">
        {question.options.map((option, optionIndex) =>
          <div key={optionIndex}
               className={`px-4 py-1 border border-gray-400 mx-1 cursor-pointer rounded ${optionIndex === selectedOption ? "bg-pohutukawa-400 text-white" : ""} ${optionIndex === question.correct ? "ring-4 ring-pohutukawa-400" : ""}`}
               onClick={() => answer(optionIndex)}>
            {option}
          </div>)}
      </div>
    </>
  );
}

