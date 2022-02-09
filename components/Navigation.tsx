import {useUserStore} from '../util/client';
import Link from 'next/link';
import {Brand} from './Brand';
import {User} from './User';
import {useRouter} from 'next/router';

export function Navigation() {
    const [user] = [useUserStore(store => store.user)];
    useUserStore(store => store.load());

    return <div
        className="bg-white border-light border-t lg:border-r shadow-xl p-4 lg:p-6 lg:min-w-[250px] flex flex-col justify-between flex-shrink-0 my-0">
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
    return <Link href={props.link}><a className={`my-1 rounded-lg select-none ${active ? 'bg-primary text-white' : ' hover:bg-light-500'}`}>
        <div className="hidden lg:block px-4 py-2 rounded-lg">{props.label}</div>
        <img src={props.image} className={`w-12 lg:hidden ${active ? 'invert' : 'dark:invert dark-invert'}`}/>
    </a></Link>;
}


export function MobileTop() {
    return <div className="lg:hidden bg-white border-b border-light shadow flex justify-between flex-shrink-0 px-4 py-3 overflow-x-hidden">
        <Brand/>
        <User mobile={true}/>
    </div>;
}