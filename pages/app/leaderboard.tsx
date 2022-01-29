import {Question} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {QuestionSubmission} from '../../components/QuestionSubmission';
import {Question as QuestionComponent} from '../../components/Question';
import {useQuestionStore, useRequireLogin, useUserStore} from '../../util/client';
import {useLeaderboardStore} from '../../util/client/useLeaderboardStore';
import {price} from '../../util/market';
import {useEffect} from 'react';

const Home: NextPage = () => {
    useRequireLogin();
    const [users, usersLoad] = useLeaderboardStore(store => [store.users, store.load])
    const [me] = useUserStore(store => [store.user, store.load()])

    useEffect(() => {
        usersLoad();
    }, [usersLoad]);

    return <Site>
        <div className="max-w-xl mx-auto  space-y-4 py-4">
            {users
                .sort((a, b) => b.score - a.score).map((user, index) => <div key={user.image} className="flex">
                <div className={`font-bold mr-2 w-16  ${index < 3 ? 'text-6xl' : 'text-5xl'} ${user.name === me?.username ? 'text-primary' : 'text-white'}`}>
                    {index+1}
                </div>
                <div className={`bg-white border border-light px-4 ${index < 3 ? ' py-2' : ''} flex justify-between items-center w-full shadow`}>
                    <div className="flex space-x-2">
                        <img src={user.image} className="w-8 flex-shrink-0"/>
                        <div className="text-lg">{user.name}</div>
                    </div>
                    <div className="font-bold font-display">{price(user.score)}</div>
                </div>
            </div>)}
        </div>
    </Site>
}

export default Home
