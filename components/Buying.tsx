import {Candidate} from "@prisma/client";
import {calculateStockPrice} from "../util/market";
import {useEffect, useState} from "react";
import {useUserStore} from "../util/store";

function BuyingRect(props: { index: number, own?: boolean, selected?: true }) {
    return <div className={`w-4 h-4 mb-1 mr-1 ${props.own ? 'bg-dark' : 'bg-white'} text-xs text-center text-[#aaa]`}>
        {props.index + 1}
    </div>;
}

export function Buying(props: { selected?: Candidate & { stock: number } }) {

    const user = useUserStore(store => store.user);
    const stockAmount = user?.Stock.find(stock => stock.candidateName === props.selected?.name)?.amount ?? 0;

    return <div className="flex justify-between">
        <div>
            <div>Candidate</div>
            <div className="font-display text-xl font-bold mb-4">{props.selected?.name}</div>
            <div>Market price</div>
            <div className="font-display text-xl font-bold">{calculateStockPrice(props.selected?.stock!)} g-points</div>
        </div>
        {user && <div className="flex flex-wrap">
            {Array(stockAmount)
                .fill(0)
                .map((rect,index) => <BuyingRect key={index} index={index} own={true}/>)}
            {Array(10)
                .fill(0)
                .map((rect,index) => <BuyingRect key={index} index={index+stockAmount}/>)}
        </div>}
    </div>;
}
