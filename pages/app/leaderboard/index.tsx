import type {NextPage} from 'next'
import {useEffect, useState} from 'react';
import {Site} from '../../../components';
import {useRequireLogin, useUserStore} from '../../../util/client';
import {useLeaderboardStore} from '../../../util/client/useLeaderboardStore';
import {useRouter} from 'next/router';
import {price} from '../../../util/market';
import Link from 'next/link';

const Home: NextPage = () => {
    useRequireLogin();
    const router = useRouter();
    const [leaderboards, loaded, load, selected, setSelected, loadSelected] = useLeaderboardStore(store => [store.leaderboards, store.loaded, store.load, store.preferencedBoard, store.savePreference, store.loadPreference])
    const [me] = useUserStore(store => [store.user, store.load()]);

    useEffect(() => {
        load();
    }, [load]);
    useEffect(() => {
        loadSelected();
    }, [loadSelected]);
    useEffect(() => {
        if (loaded && leaderboards.length === 0) router.push('/app/leaderboard/join');
    }, [loaded, leaderboards, router]);

    const selectedBoard = leaderboards.find(board => board.name === selected);
    return <Site>
        <div className="mx-auto max-w-xl">
            <div className="flex my-3 space-x-2">
                {leaderboards.map(leaderboard => <div
                    className={`text-sm px-4 py-1 cursor-pointer border border-light rounded-lg font-bold
                    ${leaderboard.name === selected ? ' bg-primary text-white' : 'bg-white'}
                    `}
                    key={leaderboard.name}
                    onClick={() => setSelected(leaderboard.name)}>{leaderboard.name}</div>)}
            </div>

            <div className="flex flex-col space-y-2">
                {selected && <>
                    {selectedBoard?.users.sort((a, b) => b.score - a.score).map((user, index) => <div
                        key={user.image}
                        className="flex items-center"
                    >
                        <div className={`mr-2 w-16 text-4xl
                        ${user.image === me?.image ? 'text-primary' : 'text-dark opacity-30'}
                        `}>
                            {index + 1}
                        </div>
                        <div
                            className={`bg-white border border-light px-4 py-2 flex justify-between items-center w-full shadow-sm rounded-xl`}>
                            <div className="flex space-x-2">
                                <img src={user.image} className="w-8 flex-shrink-0 rounded-full" alt="user image"/>
                                <div className="text-lg">{user.name}</div>
                            </div>
                            <div className="font-bold font-display">{price(user.score)}</div>
                        </div>
                    </div>)}
                    {selectedBoard && <Link href={`/app/leaderboard/info?board=${selectedBoard?.code}`}>
                      <div className={'mt-2 opacity-50 text-xs italic text-right underline cursor-pointer'}>
                        weitere Infos
                      </div>
                    </Link>}
                </>}
            </div>
        </div>
    </Site>
}

export default Home
