import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {post as _post, useCandidateStore, useQuestionStore, useRequireLogin} from '../../util/client';
import {useState} from "react";

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()])
    const [questions] = useQuestionStore(store => [store.questions, store.load()])
    const [loading, setLoading] = useState(false);
    const post = (path: string, data: any) => {
        setLoading(true);
        _post(path, data).finally(() => setLoading(false));
    }

    function terminate(name: string) {
        if (!confirm(`${name} TERMINIEREN?`)) return;
        post('/api/admin/terminate', {name});
    }

    function lock(locked: boolean) {
        post('/api/admin/lock', {locked});
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
        <div
            className={`fixed left-1/2 -translate-x-1/2 bg-primary px-8 py-2 rounded transition ${loading ? 'top-4' : '-top-12'}`}>Loading
        </div>
        <div className="max-w-xl mx-auto">
            <div className="font-bold text-2xl uppercase my-4">Spontante Sperre</div>
            <div className="grid grid-cols-2 gap-2 m-1">
                <div
                    className="p-4 cursor-pointer border-2 border-primary rounded"
                    onClick={() => lock(true)}
                >LOCK</div>
                <div
                    className="p-4 cursor-pointer border-2 border-opposite rounded"
                    onClick={() => lock(false)}
                >UNLOCK</div>
            </div>
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
            </div>
            <div className="font-bold text-2xl uppercase my-4">Fragen</div>
            {questions.filter(q => q.answerId === null).map(question => <div key={question.id}>
                <div>{question.text}</div>
                {question.option.map((option, i) => <div key={option}
                                                         className="inline-block px-4 py-2 m-1 cursor-pointer border border-light rounded"
                                                         onClick={() => answer(question.id, i)}>{option}</div>)}
            </div>)}
        </div>
    </Site>
}

export default Home
