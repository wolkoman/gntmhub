import {calculatePrice, calculateStockPrice, calculateStocksForPrice, payout, price} from '../util/market';
import {useState} from 'react';
import {post, useCandidateStore, useUserStore} from '../util/client';
import {Scatter, ScatterChart, XAxis, YAxis} from 'recharts';

function BuyingRect(props: { index: number, own?: boolean, mobile: boolean, selected?: boolean, onClick?: () => any, onMouseEnter?: () => any, onMouseLeave?: () => any, hide?: boolean }) {
    return props.hide ? <></> : <div
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
        className={`cursor-pointer rounded ${props.mobile
            ? 'h-10 w-full'
            : 'w-8 h-8'
        } ${props.selected
            ? (props.own
                ? 'bg-primary text-white'
                : 'bg-opposite text-white') :
            (props.own
                ? 'bg-dark text-[#aaa]'
                : 'bg-white text-black')
        } text-sm font-bold flex items-center justify-center font-display`}>
        {props.index + 1}
    </div>;
}

export function Buying(props: { selected?: string, onClose: () => any }) {

    const [user, setUserPoints, addUserCandidateStock] = useUserStore(store => [store.user, store.setPoints, store.addCandidateStock]);
    const [candidate, setCandidateStock] = useCandidateStore(store => [props.selected ? store.getCandidate(props.selected) : undefined, store.setCandidateStock]);
    const stockAmount = user?.Stock.find(stock => stock.candidateName === candidate?.name)?.amount ?? 0;
    const [hoveredTrade, setHoveredTrade] = useState<number>();
    const [trading, setTrading] = useState<{ loading: boolean, error?: string }>({loading: false});
    const payableStocks = calculateStocksForPrice(user?.Stock.find(stock => stock.candidateName === candidate?.name)?.amount, +(user?.points as unknown as number) + payout());
    const data02 = [
        {x: 30, y: 20},
        {x: 50, y: 180},
        {x: 75, y: 240},
        {x: 100, y: 100},
        {x: 120, y: 190},
    ];

    function trade(amount?: number) {
        if (!candidate || !user || !amount) return;
        setTrading({loading: true});
        const price = calculatePrice(candidate?.stock!, amount);
        post('/api/intern/trade', {candidateName: candidate?.name, price, amount})
            .then((response: any) => {
                setTrading({loading: false});
                setUserPoints(response.newPoints);
                addUserCandidateStock(candidate.name, amount);
                setCandidateStock(candidate.name, response.newStock);
            })
            .catch(({error, newStock}) => {
                setTrading({loading: false, error});
                if (newStock) {
                    setCandidateStock(candidate.name, newStock);
                }
            });
    }

    return <div className="flex flex-col lg:flex-row justify-between items-start relative space-y-4 lg:space-y-0">
        <div className="flex-shrink-0">
            <div>Kandidatin</div>
            <div className="font-display text-xl font-bold mb-4">{candidate?.name}</div>
            <div>Marktpreis</div>
            <div className="font-display text-xl font-bold">{price(calculateStockPrice(candidate?.stock! + 1))}
            </div>
        </div>
        <div className="hidden lg:block">
            <div>Wertverlauf</div>
            <ScatterChart width={400} height={150}>
                <Scatter data={candidate?.history} fill="#8884d8" line={{className: "line"}} shape={<></>}/>
                <YAxis type="number" dataKey="x" name="weight"/>
            </ScatterChart>
        </div>
        <div className={`flex-shrink-0 ${candidate?.dividends.length || 'hidden'}`}>
            <div>Dividenden</div>
            <div className="font-display text-xl  mb-42">
                {candidate?.dividends.map(dividend => <div key={dividend.id} className="flex">
                    <div
                        className="w-16 font-bold">{new Date(dividend.time * 3600000).toLocaleDateString().substring(0, 5)}</div>
                    <div className="">{price(dividend.points)}</div>
                </div>)}
            </div>
        </div>
        <div className={`w-full lg:w-auto ${trading.loading ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex flex-row lg:flex-row-reverse justify-between">
                <div className="mb-2">Aktienhandel</div>
                <div className={`mb-2 font-bold ${(hoveredTrade ?? 0) < 0 ? 'text-opposite' : 'text-primary'}`}>
                    {hoveredTrade ? price(-calculatePrice(candidate?.stock!, hoveredTrade)) : <></>}</div>
            </div>
            <div className={stockAmount === 0 && payableStocks === 0 ? 'font-display font-bold text-xl' : 'hidden'}>
                Kein Handel möglich
            </div>
            <div className="lg:hidden grid grid-cols-5 gap-2">
                {Array(stockAmount)
                    .fill(0)
                    .map((rect, index) => <BuyingRect
                        mobile={true}
                        key={index}
                        index={index} own={true}
                        hide={(stockAmount - 10) > index + (10 - Math.min(payableStocks, 10))}
                        selected={(hoveredTrade ?? 0) <= (index - stockAmount)}
                        onClick={() => setHoveredTrade(index - stockAmount)}/>)}
                {Array(payableStocks).fill(0)
                    .map((rect, index) => <BuyingRect
                        mobile={true}
                        key={index}
                        index={index + stockAmount}
                        hide={index >= 20 - Math.min(stockAmount, 10)}
                        selected={(hoveredTrade ?? 0) >= (index + 1)}
                        onClick={() => setHoveredTrade(index + 1)}/>)}

            </div>
            <div className="hidden lg:grid grid-cols-5 gap-2" onMouseLeave={() => setHoveredTrade(undefined)}>
                {Array(stockAmount)
                    .fill(0)
                    .map((rect, index) => <BuyingRect
                        mobile={false}
                        key={index}
                        index={index} own={true}
                        hide={(stockAmount - 10) > index + (10 - Math.min(payableStocks, 10))}
                        selected={(hoveredTrade ?? 0) <= (index - stockAmount)}
                        onClick={() => trade(index - stockAmount)}
                        onMouseEnter={() => setHoveredTrade(index - stockAmount)}/>)}
                {Array(payableStocks).fill(0)
                    .map((rect, index) => <BuyingRect
                        mobile={false}
                        key={index}
                        index={index + stockAmount}
                        hide={index >= 20 - Math.min(stockAmount, 10)}
                        selected={(hoveredTrade ?? 0) >= (index + 1)}
                        onClick={() => trade(index + 1)}
                        onMouseEnter={() => setHoveredTrade(index + 1)}/>)}

            </div>
            <div
                className="lg:hidden bg-black text-white p-4 rounded-lg font-bold font-display text-xl text-center mt-4"
                onClick={() => trade(hoveredTrade)}>Trade
            </div>

            {trading.error &&
              <div className="my-3 font-bold text-primary border-2 border-primary p-2 rounded">{trading.error}</div>}
        </div>
        <div
            className={`cursor-pointer absolute left-1/2 h-12 w-12 rounded-full bg-white border border-light -translate-x-1/2 -translate-y-1 transition ${props.selected ? '-top-12' : ''} flex justify-center`}
            onClick={() => props.onClose()}>
            <img src="/IconBack.svg" className="w-2/3 dark:invert dark-invert"/>
        </div>
    </div>;
}
