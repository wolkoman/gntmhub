import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {useEffect, useState} from 'react';
import {Buying} from '../../components/Buying';
import {useCandidateStore, useRequireLogin, useUserStore} from '../../util/client';
import {Candidate} from "../../components/Candidate";

const Home: NextPage = () => {
    useRequireLogin();
    const [user] = useUserStore(store => [store.user, store.load()]);
    const [candidates, lockups] = useCandidateStore(store => [store.candidates, store.lockups, store.load()]);
    const [lockupsData, setLockupsData] = useState<{upcoming: any[], active: any[]}>({upcoming: [], active: []});
    const [selected, setSelected] = useState<string | undefined>();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            setLockupsData({
                upcoming: lockups.filter(lockup => lockup.start > now && lockup.start - 3600*1000*10 < now),
                active: lockups.filter(lockup => lockup.start < now && lockup.end > now),
            });
        }, 10000);
        return () => clearInterval(interval);
    }, [setLockupsData]);

    return <Site>
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full  py-4">
            {candidates
                ?.sort((a, b) => b.stock - a.stock)
                .sort((a, b) => (a.terminated ? 1 : 0) - (b.terminated ? 1 : 0))
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
            className={`leading-4 absolute bottom-0 left-0 w-full transition  ${selected ? '' : 'translate-y-full'}`}>
            <div
                className="lg:mx-6 bg-white border-light border drop-shadow-[0_-5px_5px_rgba(0,0,0,0.05)] p-6 rounded-t-xl ">
                <Buying selected={selected} onClose={() => setSelected(undefined)}/>
            </div>
        </div>
    </Site>
}

export default Home
