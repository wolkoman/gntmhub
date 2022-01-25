import {useUser} from '@auth0/nextjs-auth0';
import {Candidate, PrismaClient} from '@prisma/client'
import type {NextPage} from 'next'
import Link from 'next/link';
import {Site} from '../../components/Site';
import {useRequireLogin} from "../../util/requireLogin";
import {useCandidateStore, useUserStore} from "../../util/store";
import {calculatePrice, calculateStockPrice} from "../../util/market";

const Home: NextPage = () => {

    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates,  store.load()]);

    return <Site>

        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  gap-6 w-full">
            {candidates?.map(candidate => <div
                key={candidate.name}
                className="relative h-44 overflow-hidden bg-light flex flex-col justify-between"
            >
                <div className="bg-contain bg-no-repeat bg-top h-full absolute top-0 left-0 w-full"
                     style={{backgroundImage: `url(${candidate.picture})`}}/>
                <div className="font-display p-4 text-lg font-bold">{candidate.name}</div>
                <div className="font-display p-4 text-5xl text-right opacity-50">{calculateStockPrice(candidate.stock)}</div>
            </div>)}
        </div>

    </Site>
}

export default Home
