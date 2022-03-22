import type {NextPage} from 'next'
import {ReactNode, useEffect, useState} from 'react';
import {Site} from '../../../components';
import {post, useRequireLogin, useUserStore} from '../../../util/client';
import {useLeaderboardStore} from '../../../util/client/useLeaderboardStore';
import {useRouter} from 'next/router';
import {payout, price} from '../../../util/market';
import Link from 'next/link';

const Home: NextPage = () => {
    useRequireLogin();
    const router = useRouter();
    const [leaderboards, users, loaded, load, selected, setSelected, loadSelected] = useLeaderboardStore(store => [
        store.leaderboards,
        store.users,
        store.loaded,
        store.load,
        store.preferencedBoard,
        store.savePreference,
        store.loadPreference])
    const [me] = useUserStore(store => [store.user]);

    useEffect(() => {
        load();
    }, [load]);
    useEffect(() => {
        loadSelected();
    }, [loadSelected]);
    useEffect(() => {
        if (loaded && leaderboards.length === 0) router.push('/app/leaderboard/join');
    }, [loaded, leaderboards, router]);

    const isGlobal = selected === 'GLOBAL';
    const selectedBoard = isGlobal
        ? {owner: false, name: 'GLOBAL', code: '', users}
        : leaderboards.find(board => board.name === selected);
    const boardUser = selectedBoard?.users
        .map(user => users.find(u => u.image === user.image)!)
        .sort((a, b) => b.score - a.score);

    return <Site>
        <div className="mx-auto max-w-xl">

            <div className="flex justify-between my-4">
                <div className="flex flex-wrap">
                    <LeaderboardButton selected={selectedBoard?.name === 'GLOBAL'}
                                       onClick={() => setSelected('GLOBAL')}>
                        🌐 Global
                    </LeaderboardButton>

                    {leaderboards.map(leaderboard => <LeaderboardButton
                            selected={leaderboard.name === selectedBoard?.name}
                            key={leaderboard.name}
                            onClick={() => setSelected(leaderboard.name)}
                        >
                            {leaderboard.name}
                        </LeaderboardButton>
                    )}
                </div>
                <LeaderboardButton onClick={() => router.push('/app/leaderboard/join')}>
                    +
                </LeaderboardButton>
            </div>

            <div className="flex flex-col space-y-2">
                {selected && <>
                  <div className="grid lg:grid-cols-3 gap-3">
                    <div className="lg:mt-12 hidden lg:block"><UserCard index={2} user={boardUser?.[2]}/></div>
                    <div className=""><UserCard index={0} user={boardUser?.[0]} winnerPhrase={true}
                                                me={boardUser?.[0]?.image === me?.image}/></div>
                    <div className="grid grid-cols-2 gap-5 lg:hidden">
                      <UserCard index={1} user={boardUser?.[1]}/>
                      <UserCard index={2} user={boardUser?.[2]}/>
                    </div>
                    <div className="hidden lg:block mt-6"><UserCard index={1} user={boardUser?.[1]}/></div>
                  </div>
                  <br/>
                    {boardUser?.slice(3).map((user, index) =>
                        <UserEntry key={user.image} user={user} index={index} me={user.image === me?.image}/>
                    )}

                    {selectedBoard && selected !== 'GLOBAL' &&
                      <Link href={`/app/leaderboard/info?board=${selectedBoard?.code}`}>
                        <div className={'mt-2 opacity-50 text-xs italic text-right underline cursor-pointer'}>
                          teile diese Rangliste mit anderen
                        </div>
                      </Link>}
                </>}
            </div>
        </div>
    </Site>
}

function UserCard(props: { index: number, user?: any, me?: boolean, winnerPhrase?: boolean }) {
    if (!props.user) return <></>;

    function setPhrase() {
        const winnerPhrase = prompt('Lieblingsspruch? (max. 100 Zeichen)');
        post('/api/intern/winner-phrase', {winnerPhrase})
            .then(() => location.reload());
    }

    return <div
        className={`bg-white border border-light px-4 py-7 w-full rounded-xl space-y-3 text-center h-full`}>
        <div className="font-bold">
            {props.index + 1}
        </div>
        <div className="flex space-x-2 justify-center">
            <img src={props.user.image} className="w-8 flex-shrink-0 rounded-full" alt="user image"/>
            <div className="text-2xl font-bold">{props.user.name}</div>
        </div>
        <div className="">{price(props.user.score + payout(), true)}
            <div className="hidden lg:inline"> g-points</div>
        </div>
        {props.winnerPhrase && <>
          <div className="italic text-primary font-bold break-all">{props.user.winnerPhrase}</div>
            {props.me && <div className="text-xs mt-2 px-1 rounded bg-light cursor-pointer" onClick={() => setPhrase()}>
              change phrase
            </div>}
        </>}
    </div>;
}

function UserEntry(props: { user: any, me: boolean, index: number }) {
    return <div

        className="flex items-center"
    >
        <div className={`mr-4 w-16 text-4xl font-bold text-right `}>
            <div className={props.me ? 'text-primary' : 'text-dark opacity-30'}>
                {props.index + 4}
            </div>
        </div>
        <div
            className={`bg-white border border-light px-4 py-2 flex justify-between items-center w-full rounded-xl`}>
            <div className="flex space-x-2">
                <img src={props.user?.image} className="w-8 flex-shrink-0 rounded-full" alt="user image"/>
                <div className="text-lg">{props.user?.name}</div>
            </div>
            <div className="font-bold font-display">{price(props.user.score + payout(), true)}
                <div className="hidden lg:inline"> g-points</div>
            </div>
        </div>
    </div>;
}

function LeaderboardButton(props: { selected?: boolean, onClick: () => any, children: ReactNode }) {
    return <div
        className={`text-sm my-1 mr-1 px-4 py-1 cursor-pointer border border-light rounded-lg font-bold
                    ${props.selected ? ' bg-primary text-white' : 'bg-white'}
                    `}
        onClick={props.onClick}
    >
        {props.children}
    </div>
}

export default Home
