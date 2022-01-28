import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {calculateStockPrice, price} from '../../util/market';
import {useState} from 'react';
import {Buying} from '../../components/Buying';
import {useCandidateStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()]);
    const [selected, setSelected] = useState<string | undefined>()

    return <Site>
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
            {candidates?.map(candidate => <div
                key={candidate.name}
                className={`relative h-44 overflow-hidden bg-light flex flex-col justify-between cursor-pointer select-none ${selected === candidate.name ? 'bg-primary text-white' : ''}`}
                onClick={() => setSelected(candidate.name)}
            >
                <div
                    className={`bg-contain bg-no-repeat bg-top h-full absolute top-0 left-0 w-full transition  ${selected === candidate.name ? 'scale-125' : ''}`}
                    style={{backgroundImage: `url(${candidate.picture})`}}/>
                <div
                    className={`font-display p-4 text-lg font-bold transition  ${selected === candidate.name ? 'text-xl' : ''}`}>{candidate.name}</div>
                <div
                    className="font-display p-4 text-5xl text-right opacity-50">{price(calculateStockPrice(candidate.stock + 1), true)}</div>
            </div>)}
        </div>
        <div
            className={`leading-4 absolute bottom-0 left-0 w-full transition  ${selected ? '' : 'translate-y-full'}`}>
            <div className="lg:mx-6 bg-light border-white border-t-8 box-border p-6 ">
                <Buying selected={selected} onClose={() => setSelected(undefined)}/>
            </div>
        </div>
    </Site>
}

export default Home
