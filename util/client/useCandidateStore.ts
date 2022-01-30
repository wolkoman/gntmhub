import {Candidate} from '@prisma/client';
import create from 'zustand';
import {LoadingStore, load} from './loadingStore';


export const useCandidateStore = create<LoadingStore<{candidates: (Candidate & { stock: number, dividends: {time: number, points: number}[] })[]}> & {
    getCandidate: (name: string) => (Candidate & { stock: number, dividends: {time: number, points: number}[] }),
    setCandidateStock: (name: string, stock: number) => any,
}>((set, get) => ({
    candidates: [],
    ...load(set, get, '/api/intern/candidates'),
    getCandidate(name) {
        return get().candidates?.find(candidate => candidate.name === name)!;
    },
    setCandidateStock(name, stock) {
        console.log('set stock', stock);
        set({
            candidates: get().candidates?.map(candidate =>
                candidate.name === name
                    ? {...candidate, stock}
                    : candidate)
        })
    }
}))