import {Answer, Question} from '@prisma/client';
import {useState} from 'react';
import {post} from '../util/client';

export function Question(props: { question: Question & { Answer: Answer[] }, setAnswer: (answer: number) => void }) {
    const deadline = new Date(props.question.deadline);
    const active = deadline.getTime() > new Date().getTime();
    const answerIndex = props.question.Answer[0]?.answerIndex;
    const [loading, setLoading] = useState(false);

    function answer(index: number) {
        setLoading(true);
        post('/api/intern/answer-question', {answerIndex: index, questionId: props.question.id})
            .then(() => {
                props.setAnswer(index);
            })
            .finally(() => setLoading(false));
    }

    return <div
        className={`p-4 my-4 ${active ? 'border-l-4 border-primary' : ''} ${loading && 'pointer-events-none opacity-50'}`}
    >
        <div className="font-display text-xl font-bold">{props.question.text}</div>
        <div className="opacity-50 text-sm italic">Deadline: {deadline.toLocaleString()}</div>

        {props.question.option.map((option, index) => <div key={index} className="my-2">
            <div
                className={`px-2 py-0.5 border-light border inline-block ${active && 'hover:bg-light cursor-pointer'} ${index === answerIndex && 'bg-primary text-white'}`}
                onClick={() => active ? answer(index) : {}}>
                {option}
            </div>
        </div>)}
    </div>;
}