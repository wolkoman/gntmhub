import {CandidateEntity, UserEntity} from "../util/mongo";
import {useEffect, useState} from "react";
import {calculatePrice} from "../util/market";
import {fetchJson} from "../util/fetchJson";
import {useRouter} from "next/router";

export function CandidateModal({candidate, user, stocks, onClose}: {
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
    }>({isLoading: false});
    const removeErrorMessage = () =>
        setFormState({isLoading: true});
    useEffect(() => setPrice(calculatePrice(stocks, candidate._id, amount)), [amount, stocks])
    const buy = () => {
        setFormState({errorMessage: null, isLoading: true});
        fetchJson("/api/market/trade", {
            candidateId: candidate._id.toString(),
            amount,
            expectedPrice: price
        }).then(() => setFormState({isLoading: false})).catch(({errorMessage}) => setFormState({
            isLoading: false,
            errorMessage
        })).finally(() => router.push(router.asPath));
    };
    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-50 bg-white"
            onClick={onClose}
        >
            <div
                className="bg-white shadow-lg flex flex-col md:flex-row rounded-lg overflow-hidden w-screen max-w-2xl"
                style={{filter: formState.isLoading ? "blur(3px)" : ""}}
                onClick={e => e.stopPropagation()}
            >
                <img src={candidate.imageUrl} className="hidden md:block"/>
                <div className="p-4">
                    <div className="text-4xl font-serif mb-4">{candidate.name}</div>
                    <div className="uppercase">Deine Aktien</div>
                    <div className="text-6xl font-bold mb-4">{user.stocks[candidate._id]}</div>
                    <div className="uppercase">Alle Aktien</div>
                    <div className="text-6xl font-bold mb-4">{stocks[candidate._id]}</div>
                    <div className="uppercase">Handel</div>
                    <div>
                        <input type="number" value={amount} onChange={(e) => setAmount(+e.target!.value!)}/>
                        <button disabled={user.points - price < 0 || formState.isLoading} onClick={buy}>Buy</button>
                        <div>{user.points} {price < 0 ? "+" : "-"} {Math.abs(price)} = {user.points - price}</div>
                        {formState.errorMessage ? <div
                            className="my-2 p-2 border-red-500 border rounded text-red-500">{formState.errorMessage}</div> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
