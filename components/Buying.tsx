import {calculateStockPrice, price} from '../util/market';
import {useCandidateStore} from '../util/client';
import {Scatter, ScatterChart, YAxis} from 'recharts';
import {BuyingPanel} from './BuyingPanel';

export function Buying(props: { selected: string, onClose: () => any }) {

    const [candidate, candidates] = useCandidateStore(store => [store.getCandidate(props.selected), store.candidates]);
    const remaining = candidates.filter(c => !c.terminated).length;

    return <div className="relative h-full flex p-6">
        <div className="flex flex-col grow lg:flex-row justify-end lg:justify-between items-start space-y-4 lg:space-y-0 w-full h-full overflow-y-scroll lg:space-x-5">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 w-full">
                <div className="flex-shrink-0">
                    <div>Kandidatin</div>
                    <div className="font-display text-xl font-bold mb-4">
                        {candidate?.name}
                    </div>
                    <div>Marktpreis</div>
                    <div className="font-display text-xl font-bold">
                        {price(calculateStockPrice(candidate?.stock! + 1, remaining))}
                    </div>
                </div>
                <div style={{ backgroundImage: `url(${candidate.picture})`}} className="lg:hidden w-full bg-cover bg-top h-52 bg-smudge shadow rounded-lg"/>
            </div>
            <div className="">
                <div>Wertverlauf</div>
                <div className="lg:hidden">
                <ScatterChart width={400} height={80}>
                    <Scatter data={candidate?.history} fill="#8884d8" line={{className: 'line'}} shape={<></>}/>
                    <YAxis type="number" dataKey="x" name="weight"/>
                </ScatterChart>
                </div>
                <div className="hidden lg:block">
                    <ScatterChart width={400} height={150}>
                        <Scatter data={candidate?.history} fill="#8884d8" line={{className: 'line'}} shape={<></>}/>
                        <YAxis type="number" dataKey="x" name="weight"/>
                    </ScatterChart>
                </div>
            </div>
            <div className={`flex-shrink-0 ${candidate?.dividends.length || 'hidden'}`}>
                <div>Dividenden</div>
                <div className="font-display text-xl mb-42 w-full">
                    {candidate?.dividends.map(dividend => <div key={dividend.id} className="flex">
                        <div className="w-16 font-bold">
                            {new Date(dividend.time * 3600000).toLocaleDateString().substring(0, 5)}
                        </div>
                        <div>
                            {price(dividend.points)}
                        </div>
                    </div>)}
                </div>
            </div>
            {candidate.terminated || <BuyingPanel candidate={candidate}/>}
        </div>
        <div
            className={
                `self-end lg:absolute right-0 bottom-0 lg:left-1/2 h-12 w-12
            flex justify-center shrink-0 rounded-lg bg-primary lg:bg-white border border-light
            lg:-translate-x-1/2 lg:translate-y-1/2 transition ${props.selected ? 'lg:-top-12' : ''} cursor-pointer`}
            onClick={() => props.onClose()}>
            <img src="/IconBack.svg" className="w-2/3 invert lg:invert-0 dark-invert"/>
        </div>
    </div>;
}
