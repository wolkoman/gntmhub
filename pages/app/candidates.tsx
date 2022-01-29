import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {calculateStockPrice, payout, price} from '../../util/market';
import {useState} from 'react';
import {Buying} from '../../components/Buying';
import {useCandidateStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()]);
    const [selected, setSelected] = useState<string | undefined>()

    return <Site>
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full  py-4">
            {candidates?.sort((a,b) => b.stock - a.stock).sort((a,b) => (a.terminated?1:0) - (b.terminated?1:0)).map(candidate => <div
                key={candidate.name}
                className={`
                relative h-44 overflow-hidden flex flex-col justify-between select-none border-light border shadow-lg
                ${candidate.terminated ? 'pointer-events-none cursor-auto' : 'cursor-pointer'}
                ${!candidate.terminated && ((selected === candidate.name) ? 'bg-primary text-white' : 'bg-white text-dark')}`}
                onClick={() => setSelected(candidate.name)}
            >
                <div
                    className={`bg-contain bg-no-repeat bg-top h-full absolute top-0 left-0 w-full transition  ${selected === candidate.name ? 'scale-125' : ''}`}
                    style={{backgroundImage: `url(${candidate.picture})`}}/>
                <div className={`font-display p-4 text-lg font-bold transition  ${selected === candidate.name ? 'text-xl' : ''}`}>
                    {candidate.name}
                </div>
                {candidate.terminated && <div className="absolute top-5 left-1/2 -translate-x-1/2 text-5xl">
                    ☹️
                </div>}
                <div className="font-display p-4 text-5xl text-right opacity-50">
                    {!candidate.terminated && price(calculateStockPrice(candidate.stock + 1), true)}
                </div>
            </div>)}
        </div>
        <div
            className={`leading-4 absolute bottom-0 left-0 w-full transition  ${selected ? '' : 'translate-y-full'}`}>
            <div className="lg:mx-6 bg-white border-light border drop-shadow-[0_-5px_5px_rgba(0,0,0,0.1)] p-6 ">
                <Buying selected={selected} onClose={() => setSelected(undefined)}/>
            </div>
        </div>
    </Site>
}

export default Home
