import {useUser} from "@auth0/nextjs-auth0";
import {useCandidateStore, useQuestionStore, useUserStore} from "../util/client";
import Link from "next/link";
import {useLeaderboardStore} from "../util/client/useLeaderboardStore";

export function Brand() {
    const loadings = [
        useCandidateStore(store => store.loading),
        useUserStore(store => store.loading),
        useQuestionStore(store => store.loading),
        useLeaderboardStore(store => store.loading),
    ];
    useUserStore(store => store.load());
    const loading = loadings.reduce((p,c) => p || c, false);

    return <Link href="/app">
        <div className="cursor-pointer relative overflow-hidden">
            <div className={`absolute top-1 h-8 w-36 bg-black`}/>
            <div className={`absolute top-1 h-8 w-16 bg-primary loader transition ${loading ? '' : 'opacity-0'}`}/>
            <img src="/NameLogo.svg" className="relative z-10 w-36 dark-invert"/>
        </div>
    </Link>;
}