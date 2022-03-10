import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {post, useCandidateStore, useQuestionStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()])
    const [questions] = useQuestionStore(store => [store.questions, store.load()])

    function terminate(name: string) {
        if (!confirm(`${name} TERMINIEREN?`)) return;
        post('/api/admin/terminate', {name});
    }
    function answer(questionId: number, answerIndex: number) {
        if (!confirm(`${answerIndex} BEANTWORTEN?`)) return;
        post('/api/admin/answer', {questionId, answerIndex});
    }

    function payout() {
        if (!confirm(`AUSZAHLUNG?`)) return;
        post('/api/admin/payout', {});
    }

    return <Site>
        <div className="max-w-xl mx-auto">
            <div className="font-bold text-2xl uppercase my-4">Terminieren</div>
            {candidates.filter(candidate => !candidate.terminated).map((candidate) =>
                <div
                    key={candidate.name}
                    className="inline-block px-4 py-2 m-1 cursor-pointer border border-light rounded"
                    onClick={() => terminate(candidate.name)}
                >
                    {candidate.name}
                </div>)
            }
            <div className="font-bold text-2xl uppercase my-4">DIVIDENDEN</div>
            <div
                className="inline-block px-4 py-2 m-1 cursor-pointer border border-light rounded"
                onClick={() => payout()}
            >
                Auszahlungen
            </div>            <div className="font-bold text-2xl uppercase my-4">Fragen</div>
            {questions.filter(q => q.answerId === null).map(question => <div key={question.id}>
                <div>{question.text}</div>
                {question.option.map((option, i) => <div key={option} className="inline-block px-4 py-2 m-1 cursor-pointer border border-light rounded" onClick={() => answer(question.id, i)}>{option}</div>)}
            </div>)}
        </div>
    </Site>
}

export default Home
