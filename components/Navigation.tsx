import {useCandidateStore, useQuestionStore, useUserStore} from '../util/client';
import Link from 'next/link';
import {Brand} from './Brand';
import {User} from './User';
import {useRouter} from 'next/router';
import {useLeaderboardStore} from '../util/client/useLeaderboardStore';

export function Navigation() {
    const [user] = [useUserStore(store => store.user)];
    useUserStore(store => store.load());

    return <div
        className="bg-white border-light border-t lg:border-r p-4 lg:p-6 lg:min-w-[250px] flex flex-col justify-between flex-shrink-0 my-0 relative">
        <div>
            <div className="hidden lg:flex">
                <Brand/>
            </div>
            <div className="flex lg:flex-col space-x-2 justify-around lg:space-x-0 lg:mt-6">
                <NavigationLink link="/app/candidates" image="/IconCandidates.svg" label="Kandidatinnen"/>
                <NavigationLink link="/app/questions" image="/IconQuestion.svg" label="Fragen"/>
                <NavigationLink link="/app/leaderboard" image="/IconLeaderboard.svg" label="Rangliste"/>
                {user?.admin &&
                  <NavigationLink link="/app/admin" image="/IconSettings.svg" label="Admin"/>
                }
            </div>
        </div>
        <div className="hidden lg:block">
            <User/>
        </div>
    </div>;
}

function NavigationLink(props: {label: string, image: string, link: string}) {
    const {route} = useRouter();
    const active = route === props.link;
    return <Link href={props.link}><a className={`my-1 rounded-lg select-none ${active ? 'bg-primary text-white' : ' hover:bg-smudge-500'}`}>
        <div className="hidden lg:block px-4 py-2 rounded-lg">{props.label}</div>
        <img src={props.image} className={`w-12 lg:hidden ${active ? 'invert' : 'dark:invert dark-invert'}`}/>
    </a></Link>;
}


export function LoadingBar() {

    const loadings = [
        useCandidateStore(store => store.loading),
        useUserStore(store => store.loading),
        useQuestionStore(store => store.loading),
        useLeaderboardStore(store => store.loading),
    ];
    useUserStore(store => store.load());
    const loading = loadings.reduce((p, c) => p || c, false);

    return <div className={`w-1/4 bg-primary h-1 absolute transition left-0 top-0 loader z-40 ${loading ? '' : 'opacity-0'}`}/>;
}

export function MobileTop() {
    return <div className="lg:hidden bg-white border-b border-light flex justify-between flex-shrink-0 px-4 py-3 overflow-x-hidden relative">
        <Brand/>
        <User mobile={true}/>
    </div>;
}