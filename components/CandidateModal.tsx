import { CandidateEntity, UserEntity } from "../util/mongo";
import { useEffect, useState } from "react";
import { calculatePrice } from "../util/market";
import { fetchJson } from "../util/fetchJson";
import { useRouter } from "next/router";

export function CandidateModal({
  candidate,
  user,
  stocks,
  onClose,
}: {
  candidate: CandidateEntity;
  user: UserEntity;
  stocks: any;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const router = useRouter();
  const [formState, setFormState] = useState<{
    errorMessage?: string;
    isLoading: boolean;
  }>({ isLoading: false });
  useEffect(() => setPrice(calculatePrice(stocks, candidate._id, amount)), [
    amount,
    stocks,
  ]);
  const setLimitedAmount = (amount: number | string) =>
    setAmount(Math.max(-user.stocks[candidate._id], Math.floor(+amount)));
  const trade = () => {
    setFormState({ errorMessage: null, isLoading: true });
    fetchJson("/api/market/trade", {
      candidateId: candidate._id.toString(),
      amount,
      expectedPrice: price,
    })
      .then(() => setFormState({ isLoading: false }))
      .catch(({ errorMessage }) =>
        setFormState({
          isLoading: false,
          errorMessage,
        })
      )
      .finally(() => router.push("/dashboard"));
  };
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-500 z-10"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-2xl flex flex-col md:flex-row rounded-lg overflow-hidden w-screen max-w-2xl"
        style={{
          filter: formState.isLoading ? "contrast(80%)" : "",
        }}
        onClick={e => e.stopPropagation()}
      >
        <img src={candidate.imageUrl} className="hidden md:block" />
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="text-4xl font-serif mb-4 flex items-center">
            <div
              style={{
                backgroundImage: `url(${candidate.imageUrl})`,
                backgroundSize: "cover",
              }}
              className="w-28 h-28 mr-4 md:hidden rounded-lg"
            />
            {candidate.name}
          </div>
          <div className="grid grid-cols-2 w-full py-4">
            {[
              ["Deine Aktien", user.stocks[candidate._id]],
              [
                "Dein Aktienwert",
                (-calculatePrice(
                  stocks,
                  candidate._id,
                  -user.stocks[candidate._id]
                )).toFixed(2),
              ],
              ["Kurs", calculatePrice(stocks, candidate._id, 1).toFixed(2)],
            ].map(([key, value]) => (
              <div className="mb-4" key={key}>
                <div className="uppercase text-sm">{key}</div>
                <div className="text-3xl">{value}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex">
              <button
                disabled={formState.isLoading}
                onClick={() => setLimitedAmount(amount - 1)}
                className="px-3 py-2 rounded flex-1 border border-pohutukawa-400 text-pohutukawa-400"
                children="◀"
              />
              <div className="px-6 flex-1 text-center">
                <input
                  className="text-lg text-center w-20"
                  type="number"
                  value={amount}
                  step="1"
                  onChange={e => setLimitedAmount(e.target.value)}
                />
                <div
                  className={
                    "text-sm italic " +
                    (price > 0 ? "text-red-500" : "text-gray-500")
                  }
                >
                  {(-price).toFixed(2)}gp
                </div>
              </div>
              <button
                disabled={formState.isLoading}
                onClick={() => setLimitedAmount(amount + 1)}
                className="px-3 py-2 rounded flex-1 border border-pohutukawa-400 text-pohutukawa-400"
                children="▶"
              />
            </div>
            <button
              disabled={user.points - price < 0 || formState.isLoading}
              onClick={trade}
              className="px-3 py-2 flex-1 font-serif bg-pohutukawa-400 border-2 border-white text-white w-full rounded mt-4"
            >
              {formState.isLoading ? "loading" : "Handeln"}
            </button>
            {formState.errorMessage ? (
              <div className="my-2 p-2 border-red-500 border rounded text-red-500 text-xs">
                {formState.errorMessage}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
