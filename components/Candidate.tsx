import {calculateStockPrice, price} from "../util/market";

export function Candidate(props: { candidate: any, selected: boolean, onClick: () => void, ownedStocks: number }) {
    return <div
        className={`relative h-44 overflow-hidden flex flex-col justify-between select-none rounded-lg transition
                    ${props.candidate.terminated ? "pointer-events-none cursor-auto" : `cursor-pointer  border-light border ${(props.selected ? "bg-primary text-white" : "bg-white text-dark")}`}`}
        onClick={props.onClick}
    >
        <div
            className={`bg-contain bg-no-repeat bg-top h-full absolute top-8 lg:top-0 left-0 w-full transition ${props.selected ? "scale-125" : ""}`}
            style={{backgroundImage: `url(${props.candidate.picture})`}}/>
        <div
            className={`font-display p-4 text-lg font-bold transition ${props.selected ? "text-xl" : ""}`}>
            {props.candidate.name}
        </div>
        {props.candidate.terminated && <div className="absolute top-11 lg:top-5 left-1/2 -translate-x-1/2 text-5xl">
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