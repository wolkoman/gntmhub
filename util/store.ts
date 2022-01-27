import create from 'zustand'
import {Answer, Candidate, Prisma, Question, User} from '@prisma/client';
import candidates from '../pages/api/intern/candidates';

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


export const useUserStore = create<{
    setPoints: (points: number) => any;
    addCandidateStock: (name: string, stock: number) => any,
    user: (User & { Stock: { amount: number, candidateName: string }[] }) | null,
    loading: boolean,
    loaded: boolean,
    load: () => void,
}>((set, get) => ({
    user: null,
    loading: false,
    loaded: false,
    load() {
        if (get().loading || get().loaded) return;
        set({loading: true});
        fetch('/api/intern/user').then(response => response.json())
            .then(({user}) => set({user, loaded: true, loading: false}));
    },
    setPoints(points) {
        set({user: {...get().user!, points: points as unknown as Prisma.Decimal}});
    },
    addCandidateStock(name, amount) {
        const user = get().user!;
        set({
            user: {
                ...user,
                Stock: user.Stock.map(stock => stock.candidateName === name ? {
                    ...stock,
                    amount: stock.amount + amount
                } : stock)
            }
        });
    }
}))

export const useQuestionStore = create<{
    questions: (Question & { Answer: Answer[] })[],
    loading: boolean,
    loaded: boolean,
    load: () => void,
    setMyAnswer: (questionId: number, answerIndex: number) => void,
}>((set, get) => ({
    questions: [],
    loading: false,
    loaded: false,
    load() {
        if (get().loading || get().loaded) return;
        set({loading: true});
        fetch('/api/intern/questions').then(response => response.json())
            .then(({questions}) => set({questions, loaded: true, loading: false}));
    },
    setMyAnswer(questionId: number, answerIndex: number) {
        set(store => ({
            questions: store.questions.map(question => question.id === questionId
                ? {...question, Answer: [{questionId, answerIndex, userMail: '', id: 2}]}
                : question)
        }))
    }
}))