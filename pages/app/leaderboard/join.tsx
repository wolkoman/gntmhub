import type {NextPage} from 'next'
import {Site} from '../../../components';
import {post, useRequireLogin, useUserStore} from '../../../util/client';
import {useLeaderboardStore} from '../../../util/client/useLeaderboardStore';
import {useRouter} from 'next/router';

const Home: NextPage = () => {
    useRequireLogin();
    const router = useRouter();
    const [load] = useLeaderboardStore(store => [store.load]);

    function create() {
        const name = prompt("Wie heißt die neue Rangliste?");
        if(!name || name.length < 5){
            alert("Der Name ist zu kurz!");
            return;
        }
        post("/api/intern/create-leaderboard", {name})
            .then(() => {
                load();
                setTimeout(() => router.push('/app/leaderboard'), 1000);
            });
    }
    function join() {
        const code = prompt("Gib den Ranglisten Code ein");
        post("/api/intern/join-leaderboard", {code})
            .then(() => {
                load();
                setTimeout(() => router.push('/app/leaderboard'), 1000);
            })
            .catch(({err}) => alert("Diese Rangliste existert nicht"));
    }


    return <Site>
        <div className="mx-auto my-10 max-w-md flex flex-col items-center text-center">
            <img src="/FillerLeaderboard.svg"/>
            <div className="text-lg">Trete einer Rangliste bei<br/> um dich mit deinen Freunden zu vergleichen!</div>
            <div className="flex space-x-4 my-4">
                <div className="cursor-pointer px-3 py-1 bg-primary text-white font-display" onClick={join}>Beitreten</div>
                <div className="cursor-pointer px-3 py-1 bg-white font-display" onClick={create}>Erstellen</div>
            </div>

        </div>

    </Site>
}

export default Home
