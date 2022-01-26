import {Candidate} from "@prisma/client";
import {calculatePrice, calculateStockPrice} from "../util/market";
import {useEffect, useState} from "react";
import {useUserStore} from "../util/store";

function BuyingRect(props: { index: number, own?: boolean, selected?: boolean, onClick?: () => any, onMouseEnter: () => any, onMouseLeave: () => any }) {
    return <div
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
        className={`cursor-pointer w-5 h-5 ${props.selected ? 'bg-primary text-white' : (props.own ? 'bg-dark' : 'bg-white')} text-xs text-center text-[#aaa]`}>
        {props.index + 1}
    </div>;
}

export function Buying(props: { selected?: Candidate & { stock: number } }) {

    const user = useUserStore(store => store.user);
    const stockAmount = user?.Stock.find(stock => stock.candidateName === props.selected?.name)?.amount ?? 0;
    const [hoveredTrade, setHoveredTrade] = useState<number>();

    function trade(amount: number) {
        console.log("trade", amount);
        fetch("/api/intern/trade", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                candidateName: props.selected!.name,
                price: calculatePrice(props.selected!.stock, amount),
                amount
            })
        });
    }

    return <div className="flex justify-between">
        <div>
            <div>Candidate</div>
            <div className="font-display text-xl font-bold mb-4">{props.selected?.name}</div>
            <div>Market price</div>
            <div className="font-display text-xl font-bold">{calculateStockPrice(props.selected?.stock! + 1)} g-points
            </div>
        </div>
        {hoveredTrade}
        {user && <div className="flex flex-wrap">
            {Array(stockAmount)
                .fill(0)
                .map((rect, index) => <BuyingRect key={index} index={index} own={true}

                                                  onMouseEnter={() => setHoveredTrade(index)}
                                                  onMouseLeave={() => setHoveredTrade(undefined)}/>)}
            {Array(10)
                .fill(0)
                .map((rect, index) => <BuyingRect key={index} index={index + stockAmount}
                                                  selected={(hoveredTrade ?? stockAmount) >= (index + stockAmount + 1)}
                                                  onClick={() => trade(index + 1)}
                                                  onMouseEnter={() => setHoveredTrade(index + 1)}
                                                  onMouseLeave={() => setHoveredTrade(undefined)}/>)}
        </div>}
    </div>;
}
