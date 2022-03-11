interface BuyingRectProps {
    index: number;
    own?: boolean;
    mobile: boolean;
    selected?: boolean;
    onClick?: () => any;
    onMouseEnter?: () => any;
    onMouseLeave?: () => any;
    hide?: boolean;
}

export function BuyingRect(props: BuyingRectProps) {
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
