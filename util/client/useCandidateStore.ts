import {Candidate} from '@prisma/client';
import create from 'zustand';
import {LoadingStore, load} from './loadingStore';

export interface ExtendedCandidate extends Candidate {
    stock: number,
    dividends: { id: number, time: number, points: number }[],
    history: { amount: number }[]
}

export const useCandidateStore = create<LoadingStore<{
    lockups: { start: string, end: string }[],
    candidates: ExtendedCandidate[]
}> & {
    getCandidate: (name: string) => ExtendedCandidate,
    setCandidateStock: (name: string, stock: number) => any,
}>((set, get) => ({
    candidates: [],
    lockups: [],
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