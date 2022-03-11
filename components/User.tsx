import {useUserStore} from "../util/client";
import {payout, price} from "../util/market";

export function User(props: { mobile?: boolean }) {
    const [user] = useUserStore(store => [store.user, store.load()]);
    return <>
        {!!user && <div>
            <div className={`flex ${props.mobile && 'flex-row-reverse text-right space-x-2'}`}>
                <img src={user.image} alt={user?.mail!} className="rounded-3xl w-8 h-8 overflow-hidden mx-1"/>
                <div className={`flex flex-col leading-4`}>
                    <div>{user?.username}</div>
                    <div
                        className="text-primary font-bold">{price(+(user.points as unknown as number) + payout())}</div>
                </div>
            </div>
        </div>}
    </>;
}