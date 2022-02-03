import {Answer, Question} from '@prisma/client';
import {useState} from 'react';
import {post} from '../util/client';

export function Question(props: { question: Question & { Answer: Answer[] }, setAnswer: (answer: number) => void }) {
    const deadline = new Date(props.question.deadline);
    const active = deadline.getTime() > new Date().getTime();
    const unanswered = props.question.Answer.length === 0;
    const answerIndex = props.question.Answer[0]?.answerIndex;
    const [loading, setLoading] = useState(false);

    function answer(index: number) {
        setLoading(true);
        post('/api/intern/answer-question', {answerIndex: index, questionId: props.question.id})
            .then(() => props.setAnswer(index))
            .finally(() => setLoading(false));
    }

    return <div
        className={`p-4 my-4 ${active && unanswered ? `bg-white border border-light shadow rounded-xl py-24 text-center` : ``} ${loading && 'pointer-events-none opacity-50'}`}
    >
        <div className="font-display text-xl font-bold">{props.question.text}</div>
        <div className="opacity-50 text-sm italic">Deadline: {deadline.toLocaleString()}</div>

        <div className={`my-4 flex ${unanswered && active ? 'flex-col' : "flex-row"}`}>
            {props.question.option.map((option, index) => <div
                key={index}
                className={`m-1 px-3 py-1 border-light bg-white border inline-block rounded
                ${props.question.answerId === index && 'ring-4 ring-opposite-500'}
                ${active && 'hover:bg-light cursor-pointer'}
                ${index === answerIndex && 'bg-primary text-white'}`}
                onClick={() => active ? answer(index) : {}}>
                {option}
            </div>)}
        </div>
    </div>;
}