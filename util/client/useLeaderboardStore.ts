import create from 'zustand';
import {Prisma, User} from '@prisma/client';
import {load, LoadingStore} from './loadingStore';

export const useLeaderboardStore = create<LoadingStore<{ users: (User & { stockValue: number })[] }>  & {
}>((set, get) => ({
    users: [],
    ...load(set,get, '/api/intern/leaderboard'),
}))