import {useUser} from '@auth0/nextjs-auth0';
import {useCandidateStore, useQuestionStore, useUserStore} from '../util/client';
import Link from 'next/link';
import {payout, price} from '../util/market';
import {useLeaderboardStore} from '../util/client/useLeaderboardStore';

export function Navigation() {
    const [{isLoading: userLoading}, user, storeLoading, questionLoading, leaderboardLoading] = [
        useUser(),
        useUserStore(store => store.user),
        useCandidateStore(store => store.loading),
        useQuestionStore(store => store.loading),
        useLeaderboardStore(store => store.loading)
    ];
    useUserStore(store => store.load());
    const loading = userLoading || storeLoading || questionLoading || leaderboardLoading;

    return <div className="bg-light p-4 lg:p-6 lg:min-w-[200px] flex flex-col justify-between flex-shrink-0 my-0">
        <div>
            <div className="hidden lg:flex">
                <div className="font-display text-2xl font-bold">GNTMHUB</div>
                {loading && <img src="/loader.svg" className="w-7 mt-0.5 opacity-50"/>}
            </div>
            <div className="text-lg flex lg:flex-col space-x-2 justify-around lg:space-x-0 lg:space-y-2 lg:mt-6">
                <a><Link href="/app">Info</Link></a>
                <a><Link href="/app/candidates">Kandidatinnen</Link></a>
                <a><Link href="/app/questions">Fragen</Link></a>
                <a><Link href="/app/leaderboard">Rangliste</Link></a>
                {user?.admin && <a><Link href="/app/admin">Admin</Link></a>}
            </div>
        </div>
        <div className="hidden lg:block">
            <User/>
        </div>
    </div>;
}


function User(props: { mobile?: boolean }) {
    const [user] = useUserStore(store => [store.user, store.load()]);
    return <>
        {!!user && <div>
          <div className={`flex space-x-2 ${props.mobile && 'flex-row-reverse text-right space-x-2'}`}>
            <img src={user.image} alt={user?.mail!} className="rounded-3xl w-8 h-8 overflow-hidden"/>
            <div className={`flex flex-col leading-4`}>
              <div>{user?.username}</div>
              <div
                className="text-primary font-bold">{price(+(user.points as unknown as number) + payout())}</div>
            </div>
          </div>
        </div>}
    </>;
}

export function MobileTop() {
    const [{
        user: authUser,
        isLoading: userLoading
    }, storeLoading, user, questionLoading] = [useUser(), useCandidateStore(store => store.loading), useUserStore(store => store.user), useQuestionStore(store => store.loading)];
    useUserStore(store => store.load());
    const loading = userLoading || storeLoading || questionLoading;

    return <div className="lg:hidden bg-light flex justify-between flex-shrink-0 px-4 py-2 overflow-x-hidden">
        <div>
            <div className="flex">
                <div className="font-display text-2xl font-bold">GNTMHUB</div>
                {loading && <img src="/loader.svg" className="w-7 mt-0.5 opacity-50"/>}
            </div>
        </div>
        <User mobile={true}/>
    </div>;
}