import create from 'zustand';
import {fetchJson} from './fetchJson';
import {CandidateEntity, MessageEntity, QuestionEntity, UserEntity} from './DatabaseService';
import {GetDto} from '../pages/api/market/get';

export type State = {
  users: GetDto['users'];
  user?: GetDto['user'];
  candidates: GetDto['candidates'];
  stocks: GetDto['stocks'];
  questions: GetDto['questions'],
  messages: MessageEntity[];
  loading: boolean;
  loadingMessages: boolean,
  setAll: (any) => any;
  candidate: (id: string) => CandidateEntity | undefined;
  isLoggedIn: () => boolean;
  load: () => any;
  loadMessages: () => any;
  setAnswer: (questionId, answerId) => void;
};

export const useStore = create<State>((set, get) => ({
  users: [],
  candidates: [],
  user: undefined,
  messages: [],
  questions: [],
  stocks: {},
  loading: false,
  loadingMessages: false,
  setAll: data => {
    set(data);
  },
  candidate: id => get().candidates.find(candidate => candidate._id === id),
  isLoggedIn: () => !!get().user,
  load: () => {
    if (get().loading) return;
    const loaded = get().candidates.length !== 0;
    if (!loaded) {
      set({loading: true});
      fetchJson('/api/market/get')
        .then(data => set({...data, loading: false}))
        .catch((err) => {
          console.log('Request error', err);
        });
    }
  },
  loadMessages: () => {
    if (get().loadingMessages) return;
    set({loadingMessages: true});
    fetchJson('/api/market/messages')
      .then(({messages}) => set({messages}))
      .catch(() => console.log('Message error'));
  },
  setAnswer: (questionId, answerId) => {
    const myUserId = get().user._id;
    set({
      questions: get().questions.map(question => question._id === questionId ? {
        ...question,
        answers: Object.fromEntries(Object.entries(question.answers).map(([userId, answer]) => [userId, userId === myUserId ? answerId : answer]))
      } : question)
    });
  },
}));
