import create from 'zustand';
import {Candidate} from '@prisma/client';

export const useCandidateStore = create<{
    candidates: (Candidate & { stock: number })[],
    loading: boolean,
    loaded: boolean,
    load: () => void,
    getCandidate: (name: string) => (Candidate & { stock: number }),
    setCandidateStock: (name: string, stock: number) => any,
}>((set, get) => ({
    candidates: [],
    stocks: [],
    loading: false,
    loaded: false,
    getCandidate(name) {
        return get().candidates.find(candidate => candidate.name === name)!;
    },
    setCandidateStock(name, stock) {
        console.log('set stock', stock);
        set({
            candidates: get().candidates.map(candidate =>
                candidate.name === name
                    ? {...candidate, stock}
                    : candidate)
        })
    },
    load() {
        if (get().loading || get().loaded) return;
        set({loading: true});
        fetch('/api/intern/candidates').then(response => response.json())
            .then(({candidates}) => set({candidates, loaded: true, loading: false}));
    },
}))