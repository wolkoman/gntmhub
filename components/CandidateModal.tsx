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
  const removeErrorMessage = () => setFormState({ isLoading: true });
  useEffect(() => setPrice(calculatePrice(stocks, candidate._id, amount)), [
    amount,
    stocks,
  ]);
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
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-50 bg-white"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg flex flex-col md:flex-row rounded-lg overflow-hidden w-screen max-w-2xl"
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
              className="w-16 h-16 mr-4 rounded md:hidden"
            ></div>
            {candidate.name}
          </div>
          <div className="grid grid-cols-3 w-full py-4">
            {[
              ["Deine Aktien", user.stocks[candidate._id]],
              [
                "Dein Wert",
                -calculatePrice(
                  stocks,
                  candidate._id,
                  -user.stocks[candidate._id]
                ),
              ],
              ["Kurs", calculatePrice(stocks, candidate._id, 1)],
            ].map(([key, value]) => (
              <div className="mb-4" key={key}>
                <div className="uppercase text-sm">{key}</div>
                <div className="text-4xl">{value}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex">
              <button
                disabled={formState.isLoading}
                onClick={() => setAmount(f => f - 1)}
                className="px-3 py-2 rounded-l flex-1 bg-gray-300"
                children="◀"
              />
              <div className="px-6 flex-1 text-center">
                <div className="text-lg">{amount}</div>
                <div
                  className={
                    "text-sm italic " +
                    (price > 0 ? "text-red-500" : "text-green-500")
                  }
                >
                  {-price}gp
                </div>
              </div>
              <button
                disabled={formState.isLoading}
                onClick={() => setAmount(f => f + 1)}
                className="px-3 py-2 rounded-r flex-1 bg-gray-300"
                children="▶"
              />
            </div>
            <button
              disabled={user.points - price < 0 || formState.isLoading}
              onClick={trade}
              className="px-3 py-2 flex-1 font-serif bg-gray-700 text-white w-full rounded mt-4"
            >
              {formState.isLoading ? "loading" : "Trade"}
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
