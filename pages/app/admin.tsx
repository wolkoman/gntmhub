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

    function terminate(name: string) {
        if(!confirm(`${name} TERMINIEREN?`)) return;
        post('/api/admin/terminate', {name}).then()
    }

    return <Site>
        <div className="max-w-xl mx-auto">
            {candidates.map((candidate, index) => <div key={candidate.name} className="inline-block px-4 px-2 m-2 cursor-pointer" onClick={() => terminate(candidate.name)}>
                {candidate.name}
            </div>)}
        </div>
    </Site>
}

export default Home
