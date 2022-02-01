import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {calculateStockPrice, payout, price} from '../../util/market';
import {useState} from 'react';
import {Buying} from '../../components/Buying';
import {useCandidateStore, useRequireLogin, useUserStore} from '../../util/client';

function Candidate(props: { candidate: any, selected: boolean, onClick: () => void, ownedStocks: number }) {
    return <div
        className={`relative h-44 overflow-hidden flex flex-col justify-between select-none rounded-xl transition
                    ${props.candidate.terminated ? "pointer-events-none cursor-auto" : `cursor-pointer  border-light border shadow-lg ${(props.selected ? "bg-primary text-white" : "bg-white text-dark")}`}`}
        onClick={props.onClick}
    >
        <div
            className={`bg-contain bg-no-repeat bg-top h-full absolute top-8 lg:top-0 left-0 w-full transition ${props.selected ? "scale-125" : ""}`}
            style={{backgroundImage: `url(${props.candidate.picture})`}}/>
        <div
            className={`font-display p-4 text-lg font-bold transition ${props.selected ? "text-xl" : ""}`}>
            {props.candidate.name}
        </div>
        {props.candidate.terminated && <div className="absolute top-5 left-1/2 -translate-x-1/2 text-5xl">
            ☹️
        </div>}

        <div className="flex justify-between items-end relative">
            <div className={props.ownedStocks && !props.candidate.terminated
                ? `m-4 px-2 text-xl font-bold ${props.selected ? "text-white" : "text-primary"}`
                : "opacity-0"
            }>
                {props.ownedStocks}
            </div>
            <div className="font-display p-4 text-5xl opacity-70">
                {!props.candidate.terminated && <>
                    {price(calculateStockPrice(props.candidate.stock + 1), true)}
                    <span className="hidden lg:inline">gp</span></>
                }
            </div>
        </div>
    </div>;
}

const Home: NextPage = () => {
    useRequireLogin();
    const [user] = useUserStore(store => [store.user, store.load()]);
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()]);
    const [selected, setSelected] = useState<string | undefined>()

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
