import create from 'zustand';
import {Answer, Question} from '@prisma/client';
import {load, LoadingStore} from './loadingStore';

export const useQuestionStore = create<LoadingStore<{questions: (Question & { Answer: Answer[] })[]}> & {
    setMyAnswer: (questionId: number, answerIndex: number) => void,
}>((set, get) => ({
    questions: [],
    ...load(set, get, '/api/intern/questions'),
    setMyAnswer(questionId: number, answerIndex: number) {
        set(store => ({
            questions: store.questions.map(question => question.id === questionId
                ? {...question, Answer: [{questionId, answerIndex, userMail: '', id: 2}]}
                : question)
        }))
    }
}))