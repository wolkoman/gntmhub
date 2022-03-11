import {useState} from 'react';
import {post, useCandidateStore, useUserStore} from '../util/client';
import {calculatePrice, calculateStocksForPrice, payout, price} from '../util/market';
import {BuyingRect} from './BuyingRect';
import {ExtendedCandidate} from '../util/client/useCandidateStore';

export function BuyingPanel({candidate}: { candidate?: ExtendedCandidate }) {

    const [activeTrade, setActiveTrade] = useState<number>();
    const [user, setUserPoints, addUserCandidateStock] = useUserStore(store => [store.user, store.setPoints, store.addCandidateStock]);
    const [candidates, setCandidateStock] = useCandidateStore(store => [store.candidates, store.setCandidateStock]);
    const [request, setRequest] = useState<{ loading: boolean, error?: string }>({loading: false});
    const stockAmount = user?.Stock.find(stock => stock.candidateName === candidate?.name)?.amount ?? 0;

    const payableStocks = calculateStocksForPrice(candidates.find(c => c.name === candidate?.name)?.stock, +(user?.points as unknown as number) + payout());

    function trade(amount?: number) {
        if (!candidate || !user || !amount) return;
        setRequest({loading: true});
        post('/api/intern/trade', {
            candidateName: candidate?.name,
            price: calculatePrice(candidate?.stock!, amount),
            amount
        })
            .then((response: any) => {
                setRequest({loading: false});
                setUserPoints(response.newPoints);
                addUserCandidateStock(candidate.name, amount);
                setCandidateStock(candidate.name, response.newStock);
            })
            .catch(({error, newStock}) => {
                setRequest({loading: false, error});
                if (newStock) {
                    setCandidateStock(candidate.name, newStock);
                }
            });
    }


    return <div className={`w-full lg:w-auto ${request.loading ? 'pointer-events-none opacity-50' : ''}`}>
        <div className="flex flex-row lg:flex-row-reverse justify-between">
            <div className="mb-2">Aktienhandel</div>
            <div className={`mb-2 font-bold ${(activeTrade ?? 0) < 0 ? 'text-opposite' : 'text-primary'}`}>
                {activeTrade ? price(-calculatePrice(candidate?.stock!, activeTrade)) : <></>}</div>
        </div>
        <div
            className={stockAmount === 0 && payableStocks === 0 ? 'font-display font-bold text-xl' : 'hidden'}>
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
                    selected={(activeTrade ?? 0) <= (index - stockAmount)}
                    onClick={() => setActiveTrade(index - stockAmount)}/>)}
            {Array(payableStocks).fill(0)
                .map((rect, index) => <BuyingRect
                    mobile={true}
                    key={index}
                    index={index + stockAmount}
                    hide={index >= 20 - Math.min(stockAmount, 10)}
                    selected={(activeTrade ?? 0) >= (index + 1)}
                    onClick={() => setActiveTrade(index + 1)}/>)}

        </div>
        <div className="hidden lg:grid grid-cols-5 gap-2" onMouseLeave={() => setActiveTrade(undefined)}>
            {Array(stockAmount)
                .fill(0)
                .map((rect, index) => <BuyingRect
                    mobile={false}
                    key={index}
                    index={index} own={true}
                    hide={(stockAmount - 10) > index + (10 - Math.min(payableStocks, 10))}
                    selected={(activeTrade ?? 0) <= (index - stockAmount)}
                    onClick={() => trade(index - stockAmount)}
                    onMouseEnter={() => setActiveTrade(index - stockAmount)}/>)}
            {Array(payableStocks).fill(0)
                .map((rect, index) => <BuyingRect
                    mobile={false}
                    key={index}
                    index={index + stockAmount}
                    hide={index >= 20 - Math.min(stockAmount, 10)}
                    selected={(activeTrade ?? 0) >= (index + 1)}
                    onClick={() => trade(index + 1)}
                    onMouseEnter={() => setActiveTrade(index + 1)}/>)}

        </div>
        <div
            className="lg:hidden bg-dark text-white p-2.5 rounded-lg rounded font-bold font-display text-xl text-center mt-4"
            onClick={() => trade(activeTrade)}>Trade
        </div>

        {request.error &&
          <div className="my-3 font-bold text-primary border-2 border-primary p-2 rounded">{request.error}</div>}
    </div>;
}