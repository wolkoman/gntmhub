import create from 'zustand';
import {fetchJson} from './fetchJson';
import {CandidateEntity, MessageEntity, QuestionEntity, UserEntity} from './DatabaseService';

export type State = {
  users: UserEntity[];
  candidates: CandidateEntity[];
  user?: UserEntity;
  stocks: Record<string, number>;
  messages: MessageEntity[];
  loading: boolean;
  loadingMessages: boolean,
  setAll: (any) => any;
  questions: QuestionEntity[],
  candidate: (id: string) => CandidateEntity | undefined;
  isLoggedIn: () => boolean;
  load: () => any;
  loadMessages: () => any;
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
    console.log('load messages');
    fetchJson('/api/market/payouts')
      .then(({messages}) => {
        set({messages});
      })
      .catch((err) => {
        console.log('Message error');
      });
  },
}));
