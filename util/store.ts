import create from 'zustand';
import {fetchJson} from './fetchJson';
import {CandidateEntity, MessageEntity} from './DatabaseService';
import {GetDto} from '../pages/api/market/get';

export type State = {
  tradingBlocks: GetDto['tradingBlocks'];
  users: GetDto['users'];
  user?: GetDto['user'];
  candidates: GetDto['candidates'];
  stocks: GetDto['stocks'];
  stockRecords: GetDto['stockRecords'],
  questions: GetDto['questions'],
  messages: GetDto['messages'];
  loading: boolean;
  setAll: (any) => any;
  candidate: (id: string) => CandidateEntity | undefined;
  isLoggedIn: () => boolean;
  load: () => any;
  setAnswer: (questionId, answerId) => void;
  setNotificationRead: (messageId: string) => void;
  setPushEnabled: (value: boolean) => void;
};

export const useStore = create<State>((set, get) => ({
  tradingBlocks: [],
  users: [],
  candidates: [],
  stockRecords: [],
  user: undefined,
  messages: [],
  questions: [],
  stocks: {},
  loading: false,
  loadingMessages: false,
  setAll: data => set(data),
  setPushEnabled: pushEnabled => set(data => ({user: {...data.user, pushEnabled}})),
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
          window.location.assign("/");
        });
    }
  },
  setAnswer: (questionId, answerId) => {
    set({
      questions: get().questions.map(question => question._id === questionId ? {
        ...question,
        answer: answerId
      } : question)
    });
  },
  setNotificationRead: (notificationId) => {
    fetchJson('/api/notifications/read', {notificationId})
      .catch(err => console.log('Request error', err));
    set({
      messages: get().messages.map(notification => notification._id === notificationId ? {
        ...notification,
        unread: false
      } : notification)
    });
  },
}));
