import {useUserStore} from '../util/client';
import {payout, price} from '../util/market';

export function User(props: { mobile?: boolean }) {
    const [user] = useUserStore(store => [store.user]);
    return <>
        {!!user && <div>
          <div className={`flex ${props.mobile ? 'flex-row-reverse text-right space-x-2' : 'flex-col'}`}>
            <img src={user.image} alt={user?.mail!} className="rounded-3xl w-8 h-8 overflow-hidden mx-1"/>
            <div className={`flex flex-col leading-4`}>
              <div className="lg:hidden">{user?.username}</div>
              <div className="text-primary font-bold lg:mt-2 lg:text-xl">
                  {price(+(user.points as unknown as number) + payout(), true)}
              </div>
            </div>
          </div>
        </div>}
    </>;
}