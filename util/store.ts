import create from "zustand";
import { CandidateEntity, UserEntity } from "./mongo";
export type State = {
  users: UserEntity[];
  candidates: CandidateEntity[];
  user?: UserEntity;
  stocks: Record<string, number>;
  setAll: (any) => any;
  candidate: (id: string) => CandidateEntity | undefined;
  isLoggedIn: () => boolean;
};

export const useStore = create<State>((set, get) => ({
  users: [],
  candidates: [],
  user: undefined,
  stocks: {},
  setAll: data => set(data),
  candidate: id => get().candidates.find(candidate => candidate._id === id),
  isLoggedIn: () => (get().user ? true : false),
}));
