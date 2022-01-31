import type {NextPage} from 'next'
import {useEffect} from 'react';
import {Site} from '../../../components';
import {post, useRequireLogin, useUserStore} from '../../../util/client';
import {useLeaderboardStore} from '../../../util/client/useLeaderboardStore';
import {useRouter} from 'next/router';

const Home: NextPage = () => {
    useRequireLogin();
    const {query} = useRouter();
    const router = useRouter();
    const [leaderboards, preferencedBoard, load] = useLeaderboardStore(store => [store.leaderboards, store.preferencedBoard, store.loadPreference]);
    const board = leaderboards.find(b => b.code === query.board);

    useEffect(() => { load();} ,[load]);

    function delet() {
        post("/api/intern/delete-leaderboard", {code: board?.code}).then(() => router.push("/app/leaderboard"));
    }

    return <Site>
        <div className="mx-auto my-10 max-w-md flex flex-col items-center text-center">
            <div className="uppercase">RANGLISTE {board?.name}</div>
            <div className="font-display text-4xl font-bold my-12">{board?.code}</div>
            <div className="text-lg">Teile diesen Code mit deinen Freunden damit sie beitreten können!</div>
            {board?.owner && <div className="text-lg mt-6 text-primary underline cursor-pointer" onClick={delet}>Rangliste löschen</div>}

        </div>

    </Site>
}

export default Home
