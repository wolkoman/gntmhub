import {calculatePrice, calculateStockPrice, price} from '../util/market';
import {useState} from 'react';
import {useCandidateStore, useUserStore} from '../util/store';
import {post} from '../util/fetch';

function BuyingRect(props: { index: number, own?: boolean, selected?: boolean, onClick?: () => any, onMouseEnter: () => any, onMouseLeave: () => any }) {
    return <div
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
        className={`cursor-pointer w-5 h-5 ${props.selected ? 'bg-primary text-white' : (props.own ? 'bg-dark' : 'bg-white')} text-xs text-center text-[#aaa]`}>
        {props.index + 1}
    </div>;
}

export function Buying(props: { selected?: string, onClose: () => any }) {

    const [user, setUserPoints, addUserCandidateStock] = useUserStore(store => [store.user, store.setPoints, store.addCandidateStock]);
    const [candidate, setCandidateStock] = useCandidateStore(store => [props.selected ? store.getCandidate(props.selected) : undefined, store.setCandidateStock]);
    const stockAmount = user?.Stock.find(stock => stock.candidateName === candidate?.name)?.amount ?? 0;
    const [hoveredTrade, setHoveredTrade] = useState<number>();
    const [trading, setTrading] = useState<{ loading: boolean, error?: string }>({loading: false});

    function trade(amount: number) {
        if (!candidate || !user) return;
        console.log('trade', amount);
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

    return <div className="flex justify-between relative">
        <div>
            <div>Candidate</div>
            <div className="font-display text-xl font-bold mb-4">{candidate?.name}</div>
            <div>Market price</div>
            <div className="font-display text-xl font-bold">{price(calculateStockPrice(candidate?.stock! + 1))}
            </div>
        </div>
        <div className={`${trading.loading ? 'pointer-events-none opacity-50' : ''}`}>
            {user && <div>
              <div className="flex flex-wrap">
                  {Array(stockAmount)
                      .fill(0)
                      .map((rect, index) => <BuyingRect key={index} index={index} own={true}
                                                        selected={(hoveredTrade ?? 0) <= (index - stockAmount)}
                                                        onClick={() => trade(index - stockAmount)}
                                                        onMouseEnter={() => setHoveredTrade(index - stockAmount)}
                                                        onMouseLeave={() => setHoveredTrade(undefined)}/>)}
                  {Array(10)
                      .fill(0)
                      .map((rect, index) => <BuyingRect key={index} index={index + stockAmount}
                                                        selected={(hoveredTrade ?? 0) >= (index + 1)}
                                                        onClick={() => trade(index + 1)}
                                                        onMouseEnter={() => setHoveredTrade(index + 1)}
                                                        onMouseLeave={() => setHoveredTrade(undefined)}/>)}

              </div>
              <div>{trading.error}</div>
            </div>}
        </div>
        <div
            className={`absolute left-1/2 h-12 w-12 rounded-full bg-light border-8 border-white -translate-x-1/2 transition ${props.selected ? '-top-12' : ''}`}
            onClick={() => props.onClose()}>

        </div>
    </div>;
}
