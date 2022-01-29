import {useUser} from '@auth0/nextjs-auth0';
import {useCandidateStore, useQuestionStore, useUserStore} from '../util/client';
import Link from 'next/link';
import {useLeaderboardStore} from '../util/client/useLeaderboardStore';
import {Brand} from "./Brand";
import {User} from "./User";

export function Navigation() {
    const [user] = [useUserStore(store => store.user)];
    useUserStore(store => store.load());

    return <div className="bg-white border-light border-t lg:border-r shadow-xl p-4 lg:p-6 lg:min-w-[200px] flex flex-col justify-between flex-shrink-0 my-0">
        <div>
            <div className="hidden lg:flex">
                <Brand/>
            </div>
            <div className="flex lg:flex-col space-x-2 justify-around lg:space-x-0 lg:space-y-2 lg:mt-6">
                <Link href="/app/candidates"><a>
                    <div className="hidden lg:block">Kandidatinnen</div>
                    <img src="/IconCandidates.svg" className="w-12 lg:hidden dark:invert dark-invert"/>
                </a></Link>
                <Link href="/app/questions"><a>
                    <div className="hidden lg:block">Fragen</div>
                    <img src="/IconQuestion.svg" className="w-12 lg:hidden dark:invert dark-invert"/>
                </a></Link>
                <Link href="/app/leaderboard"><a>
                    <div className="hidden lg:block">Rangliste</div>
                    <img src="/IconLeaderboard.svg" className="w-12 lg:hidden dark:invert dark-invert"/>
                </a></Link>
                {user?.admin && <Link href="/app/admin"><a>
                  <div className="hidden lg:block">Admin</div>
                  <img src="/IconSettings.svg" className="w-12 lg:hidden dark:invert dark-invert"/>
                </a></Link>}
            </div>
        </div>
        <div className="hidden lg:block">
            <User/>
        </div>
    </div>;
}


export function MobileTop() {
    return <div className="lg:hidden bg-white border-b border-light shadow flex justify-between flex-shrink-0 px-4 py-3 overflow-x-hidden">
        <Brand/>
        <User mobile={true}/>
    </div>;
}