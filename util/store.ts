import create from 'zustand'
import {Candidate, User} from "@prisma/client";

export const useCandidateStore = create<{
    candidates: (Candidate & {stock: number})[],
    loading: boolean,
    loaded: boolean,
    load: () => void,
}>((set,get) => ({
    candidates: [],
    stocks: [],
    loading: false,
    loaded: false,
    load: () => {
        if(get().loading || get().loaded) return;
        set({loading: true});
        fetch("/api/intern/candidates").then(response => response.json())
            .then(({candidates}) => set({candidates, loaded: true, loading: false}));
    },
}))


export const useUserStore = create<{
    user: (User & {Stock: {amount: number, candidateName: string}[]}) | null,
    loading: boolean,
    loaded: boolean,
    load: () => void,
}>((set,get) => ({
    user: null,
    loading: false,
    loaded: false,
    load: () => {
        if(get().loading || get().loaded) return;
        set({loading: true});
        fetch("/api/intern/user").then(response => response.json())
            .then(({user}) => set({user, loaded: true, loading: false}));
    },
}))