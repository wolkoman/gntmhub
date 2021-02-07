import create from "zustand";
import { fetchJson } from "./fetchJson";
import {CandidateEntity, UserEntity} from './DatabaseService';

export type State = {
  users: UserEntity[];
  candidates: CandidateEntity[];
  user?: UserEntity;
  stocks: Record<string, number>;
  loading: boolean;
  setAll: (any) => any;
  candidate: (id: string) => CandidateEntity | undefined;
  isLoggedIn: () => boolean;
  load: () => any;
};

export const useStore = create<State>((set, get) => ({
  users: [],
  candidates: [],
  user: undefined,
  stocks: {},
  loading: false,
  setAll: data => {
    set(data);
  },
  candidate: id => get().candidates.find(candidate => candidate._id === id),
  isLoggedIn: () => !!get().user,
  load: () => {
    if (get().loading) return;
    const loaded = get().candidates.length !== 0;
    if (!loaded) {
      set({ loading: true });
      fetchJson("/api/market/get")
        .then(data => set({ ...data, loading: false }))
        .catch(() => {
          console.log("ERROR");
        });
    }
  },
}));
