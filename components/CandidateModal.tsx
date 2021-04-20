import {useEffect, useState} from 'react';
import {calculatePrice, calculateStocksForPrice} from '../util/market';
import {fetchJson} from '../util/fetchJson';
import {useRouter} from 'next/router';
import {useStore} from '../util/store';
import {Route} from '../util/routes';
import {Modal} from './Modal';
import FeatherIcon from 'feather-icons-react';


export function CandidateModal({candidateId, onClose,}: { candidateId: string; onClose: () => void; }) {
  const [candidate, stocks, user, setAll] = useStore(state => [
    state.candidate(candidateId),
    state.stocks,
    state.user,
    state.setAll,
  ]);
  const [amount, setAmount] = useState(0);
  const [limit, setLimit] = useState({min: 0, max: 0});
  const [price, setPrice] = useState(0);
  const router = useRouter();
  const [formState, setFormState] = useState<{
    errorMessage?: string;
    isLoading: boolean;
  }>({isLoading: false});
  useEffect(() => setLimit({
    min: -user.stocks[candidate._id],
    max: calculateStocksForPrice(stocks, candidateId, user.points)
  }), [stocks, user]);
  useEffect(() => setPrice(calculatePrice(stocks, candidate._id, amount)), [amount, stocks]);
  const setLimitedAmount = (amount: number | string) =>
    setAmount(Math.min(limit.max, Math.max(limit.min, Math.floor(+amount))));
  const trade = () => {
    setFormState({errorMessage: null, isLoading: true});
    fetchJson('/api/market/trade', {
      candidateId: candidate._id.toString(),
      amount,
      expectedPrice: price,
    })
      .then(data => {
        setFormState({isLoading: false});
        setAmount(0);
        setAll(data);
      })
      .catch(all => {
          setAll(all);
          setFormState({
            isLoading: false,
            errorMessage: all.errorMessage,
          });
        }
      )
      .finally(() => router.push(Route.TRADE));
  };
  const disabled = formState.isLoading || amount === 0;
  return (
    <Modal disabled={formState.isLoading} onClose={onClose}>
      <div className=" flex flex-col md:flex-row">
        <div style={{backgroundImage: `url(${candidate.imageUrl})`, backgroundSize: 'cover'}} className="w-64"/>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="text-4xl font-serif mb-4 flex items-center">
            <div
              style={{
                backgroundImage: `url(${candidate.imageUrl})`,
                backgroundSize: 'cover',
              }}
              className="w-28 h-28 mr-4 md:hidden rounded-lg"
            />
            {candidate.name}
          </div>
          <div className="grid grid-cols-2 w-full p-4">
            {[
              ['Deine Aktien', user.stocks[candidate._id]],
              [
                'Dein Aktienwert',
                (-calculatePrice(
                  stocks,
                  candidate._id,
                  -user.stocks[candidate._id]
                )).toFixed(2),
              ],
              ['Kurs', calculatePrice(stocks, candidate._id, 1).toFixed(2)],
            ].map(([key, value]) => (
              <div className="mb-2" key={key}>
                <div className="text-sm">{key}</div>
                <div className="text-3xl">{value}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex">
              <button
                disabled={formState.isLoading}
                onClick={() => setLimitedAmount(amount - 1)}
                className={`px-3 py-2 rounded flex-1 flex justify-center focus:outline-none ${amount === limit.min ? 'opacity-10 cursor-auto' : ''}`}
                children={<FeatherIcon icon="minus-circle" size={30}/>}
              />
              <div className="px-6 flex-1 text-center">
                <input
                  className="text-lg text-center w-20 dark:bg-gray-900"
                  type="number"
                  value={amount}
                  step="1"
                  onChange={e => setLimitedAmount(e.target.value)}
                />
                <div
                  className={
                    'text-sm italic ' +
                    (price > 0 ? 'text-red-500' : 'text-gray-500')
                  }
                >
                  {(-price).toFixed(2)}gp
                </div>
              </div>
              <button
                disabled={formState.isLoading}
                onClick={() => setLimitedAmount(amount + 1)}
                className={`px-3 py-2 rounded flex-1 flex justify-center focus:outline-none ${amount === limit.max ? 'opacity-10 cursor-auto' : ''}`}
                children={<FeatherIcon icon="plus-circle" size={30}/>}
              />
            </div>
            {limit.min === limit.max ? null : <div>
              <input type="range" step={1} max={limit.max} min={limit.min} value={amount}
                     onChange={(e) => setLimitedAmount(e.target.value)}/>
            </div>}
            <button
              disabled={disabled}
              onClick={trade}
              className={`px-3 py-2 flex-1 font-serif border-2 border-white text-white w-full rounded ${disabled ? 'bg-gray-400 cursor-default' : 'bg-pohutukawa-400'}`}
            >
              {formState.isLoading ? 'loading' : 'Handeln'}
            </button>
            {formState.errorMessage ? (
              <div className="my-2 p-2 border-red-500 border rounded text-red-500 text-xs">
                {formState.errorMessage}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
