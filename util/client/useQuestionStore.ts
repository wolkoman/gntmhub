import create from 'zustand';
import {Answer, Question} from '@prisma/client';

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