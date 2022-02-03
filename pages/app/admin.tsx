import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {post, useCandidateStore, useQuestionStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()])
    const [questions] = useQuestionStore(store => [store.questions, store.load()])

    function terminate(name: string) {
        if (!confirm(`${name} TERMINIEREN?`)) return;
        post('/api/admin/terminate', {name}).then()
    }
    function answer(questionId: number, answerIndex: number) {
        if (!confirm(`${answerIndex} BEANTWORTEN?`)) return;
        post('/api/admin/answer', {questionId, answerIndex}).then()
    }

    return <Site>
        <div className="max-w-xl mx-auto">
            <div className="font-bold text-2xl uppercase my-4">Terminieren</div>
            {candidates.filter(candidate => !candidate.terminated).map((candidate, index) =>
                <div
                    key={candidate.name}
                    className="inline-block px-4 px-2 m-2 cursor-pointer border border-light"
                    onClick={() => terminate(candidate.name)}
                >
                    {candidate.name}
                </div>)
            }
            <div className="font-bold text-2xl uppercase my-4">Fragen</div>
            {questions.filter(q => q.answerId === null).map(question => <div key={question.id}>
                <div>{question.text}</div>
                {question.option.map((option, i) => <div key={option} onClick={() => answer(question.id, i)}>{option}</div>)}
            </div>)}
        </div>
    </Site>
}

export default Home
