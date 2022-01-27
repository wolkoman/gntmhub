import {calculatePrice, calculateStockPrice, calculateStocksForPrice, price} from '../util/market';
import {useState} from 'react';
import {useCandidateStore, useUserStore} from '../util/store';
import {post} from '../util/fetch';

function BuyingRect(props: { index: number, own?: boolean, selected?: boolean, onClick?: () => any, onMouseEnter: () => any, onMouseLeave?: () => any, hide?: boolean }) {
    return props.hide ? <></> : <div
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
        className={`cursor-pointer w-7 h-7 ${props.selected
            ? 'bg-primary text-white' :
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
    const payableStucks = calculateStocksForPrice(user?.Stock.find(stock => stock.candidateName === candidate?.name)?.amount, user?.points as unknown as number);

    function trade(amount: number) {
        if (!candidate || !user) return;
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

    return <div className="flex flex-col lg:flex-row justify-between items-start relative">
        <div className="flex-shrink-0">
            <div>Kandidatin</div>
            <div className="font-display text-xl font-bold mb-4">{candidate?.name}</div>
            <div>Marktpreis</div>
            <div className="font-display text-xl font-bold">{price(calculateStockPrice(candidate?.stock! + 1))}
            </div>
        </div>
        <div className={trading.loading ? 'pointer-events-none opacity-50' : ''}>
            <div className="flex justify-between">
                <div className="mb-2">Handel</div>
                <div className={`mb-2 font-bold ${(hoveredTrade ?? 0) < 0 ? "text-opposite" : "text-primary"}`}>{hoveredTrade ? price(-calculatePrice(candidate?.stock!,hoveredTrade)) : <></>}</div>
            </div>

            {user && <div>
              <div className="grid grid-cols-5 gap-1" onMouseLeave={() => setHoveredTrade(undefined)}>
                  {Array(stockAmount)
                      .fill(0)
                      .map((rect, index) => <BuyingRect key={index} index={index} own={true}
                                                        hide={(stockAmount-10)>index+(10-Math.min(payableStucks,10))}
                                                        selected={(hoveredTrade ?? 0) <= (index - stockAmount)}
                                                        onClick={() => trade(index - stockAmount)}
                                                        onMouseEnter={() => setHoveredTrade(index - stockAmount)}/>)}
                  {Array(payableStucks).fill(0)
                      .map((rect, index) => <BuyingRect key={index} index={index + stockAmount}
                                                        hide={index>=20-Math.min(stockAmount, 10)}
                                                        selected={(hoveredTrade ?? 0) >= (index + 1)}
                                                        onClick={() => trade(index + 1)}
                                                        onMouseEnter={() => setHoveredTrade(index + 1)}/>)}

              </div>
              <div>{trading.error}</div>
            </div>}
        </div>
        <div
            className={`absolute left-1/2 h-12 w-12 rounded-full bg-light border-8 border-white -translate-x-1/2 -translate-y-1 transition ${props.selected ? '-top-12' : ''}`}
            onClick={() => props.onClose()}>

        </div>
    </div>;
}
