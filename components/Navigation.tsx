import {useUser} from '@auth0/nextjs-auth0';
import {useCandidateStore, useQuestionStore, useUserStore} from '../util/client';
import Link from 'next/link';
import {price} from '../util/market';

export function Navigation() {
    const [{
        user: authUser,
        isLoading: userLoading
    }, storeLoading, user, questionLoading] = [useUser(), useCandidateStore(store => store.loading), useUserStore(store => store.user), useQuestionStore(store => store.loading)];
    useUserStore(store => store.load());
    const loading = userLoading || storeLoading || questionLoading;

    return <>
        <div>
            <div className="flex">
                <div className="font-display text-2xl font-bold">GNTMHUB</div>
                {loading && <img src="/loader.svg" className="w-7 mt-0.5 opacity-50"/>}

            </div>
            <div className="text-lg flex flex-col space-y-2 mt-6">
                <a><Link href="/app">Kandidatinnen</Link></a>
                <a><Link href="/app/questions">Fragen</Link></a>
                <a><Link href="/app/leaderboard">Rangliste</Link></a>
            </div>
        </div>
        {!!user && <div>
          <div className="flex space-x-2">
            <img src={authUser?.picture!} alt={authUser?.name!} className="rounded-3xl w-8 h-8 overflow-hidden"/>
            <div className="flex flex-col leading-4">
              <div>{authUser?.name!}</div>
              <div className="text-primary font-bold">{price(user.points as unknown as number)}</div>
            </div>
          </div>
        </div>}
    </>;
}