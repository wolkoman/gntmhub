import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {useEffect, useState} from 'react';
import {Buying} from '../../components/Buying';
import {useCandidateStore, useRequireLogin, useUserStore} from '../../util/client';
import {Candidate, CandidateShadow} from '../../components/Candidate';

function Lockup() {
    const [lockupsData, setLockupsData] = useState<{ upcoming: any[], active: any[] }>({upcoming: [], active: []});
    const [lockups] = useCandidateStore(store => [store.lockups, store.load()]);

    useEffect(() => {
        const action = () => {
            const now = new Date();
            setLockupsData({
                upcoming: lockups.filter(lockup => new Date(lockup.start) > now && new Date(lockup.start).getTime() - 3600 * 1000 * 10 < new Date(now).getTime()),
                active: lockups.filter(lockup => new Date(lockup.start) < now && new Date(lockup.end) > now),
            });
        };
        action();
        const interval = setInterval(() => action(), 10000);
        return () => clearInterval(interval);
    }, [lockups, setLockupsData]);

    return <>
        {lockupsData.upcoming.map(data =>
            <div key={data.start} className="p-2 px-4 bg-white italic opacity-50">
                Die nächste Aktiensperre dauert
                von {new Date(data.start).toTimeString().substring(0, 5)} bis {new Date(data.end).toTimeString().substring(0, 5)} Uhr.
            </div>)}
        {lockupsData.active.map(data =>
            <div key={data.start}
                 className="p-2 px-4 bg-white font-bold rounded-lg bg-primary text-white">
                Es ist eine Aktiensperre aktiv! Sie dauert bis {new Date(data.end).toTimeString().substring(0, 5)} Uhr.
            </div>)}
    </>;
}

const Home: NextPage = () => {
    useRequireLogin();
    const [user] = useUserStore(store => [store.user, store.load()]);
    const [candidates, loading] = useCandidateStore(store => [store.candidates, store.loading, store.load()]);
    const [selected, setSelected] = useState<string | undefined>();


    return <Site>
        <div className="">
        <Lockup/>
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full py-4">
            {loading && Array(20).fill(0).map((_, index) => <CandidateShadow key={index}/>)}
            {candidates
                ?.sort((a, b) => b.stock - a.stock)
                ?.sort((a, b) => (a.terminated?1:0) - (b.terminated?1:0))
                .map(candidate => {
                    return <Candidate
                        key={candidate.name}
                        candidate={candidate}
                        selected={selected === candidate.name}
                        onClick={() => setSelected(candidate.name)}
                        ownedStocks={user?.Stock.find(stock => stock.candidateName === candidate.name)!.amount!}/>;
                })}
        </div>
        <div
            className={`absolute bottom-0 left-0 w-full transition h-full lg:h-auto ${selected
                ? 'top-0 bottom-[unset] lg:top-[unset] lg:bottom-0 translate-y-full translate-y-0'
                : 'translate-y-full'}`}>
            <div
                className="lg:mx-6 bg-white border-light lg:border lg:rounded-t-xl h-full">
                {selected && <Buying selected={selected} onClose={() => setSelected(undefined)}/>}
            </div>
        </div>

        </div>
    </Site>
}

export default Home
