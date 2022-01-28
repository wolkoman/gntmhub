import {Question} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {QuestionSubmission} from '../../components/QuestionSubmission';
import {Question as QuestionComponent} from '../../components/Question';
import {post, useCandidateStore, useQuestionStore, useRequireLogin, useUserStore} from '../../util/client';
import {useLeaderboardStore} from '../../util/client/useLeaderboardStore';
import {price} from '../../util/market';
import {useEffect} from 'react';

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()])
    const [questions] = useQuestionStore(store => [store.questions, store.load()])

    function terminate(name: string) {
        if (!confirm(`${name} TERMINIEREN?`)) return;
        post('/api/admin/terminate', {name}).then()
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
            {questions.map(question => <div key={question.id}>
                <div>{question.text}</div>
                {question.option.map(option => <div key={option}>{option}</div>)}
            </div>)}
        </div>
    </Site>
}

export default Home
