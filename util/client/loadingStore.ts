import create from 'zustand';
import {Question} from '@prisma/client';
import {GetState, SetState, State, StateCreator, StoreApi} from 'zustand/vanilla';
import {UseBoundStore} from 'zustand/react';

interface LoadingStore {
    loading: boolean;
    loaded: boolean;
}

export const createLoading = <TState extends State>(createState: StateCreator<TState & LoadingStore, SetState<TState & LoadingStore>, GetState<TState & LoadingStore>, any> | StoreApi<TState>): UseBoundStore<TState & LoadingStore, StoreApi<TState & LoadingStore>> => {
    return create<TState & LoadingStore>((set, get, api) => {
        if (!('getState' in createState))
            return {
                ...createState(set, get, api),
                loading: false,
                loaded: false,
            };
        else
            return {} as any;
    });
}

/*

create<{
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
}))*/