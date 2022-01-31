import create from 'zustand';
import {Prisma, User} from '@prisma/client';
import {load, LoadingStore} from './loadingStore';

const preferenceKey = 'GNTMHUB_PREFERENCE_BOARD';
export const useLeaderboardStore = create<LoadingStore<{
    leaderboards: {
        owner: boolean,
        name: string,
        code: string;
        users:{
            name: string,
            image: string,
            score: number
        }[]
    }[]
}> & {preferencedBoard?: string, savePreference: (board: string) => void, loadPreference: () => void}>((set, get) => ({
    leaderboards: [],
    preferencedBoard: undefined,
    ...load(set,get, '/api/intern/leaderboard', true),
    savePreference(preferencedBoard){
        localStorage.setItem(preferenceKey, preferencedBoard);
        set({preferencedBoard});
    },
    loadPreference(){
        set({preferencedBoard: localStorage.getItem(preferenceKey) ?? undefined});
    }
}))