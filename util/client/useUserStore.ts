import create from 'zustand';
import {Prisma, User} from '@prisma/client';
import {load, LoadingStore} from './loadingStore';

export const useUserStore = create<LoadingStore<{ user: (User & { Stock: { amount: number, candidateName: string }[] }) | null }>  &{
    setPoints: (points: number) => any;
    addCandidateStock: (name: string, stock: number) => any,
}>((set, get) => ({
    user: null,
    ...load(set,get, '/api/intern/user'),
    setPoints(points) {
        set({user: {...get().user!, points: points as unknown as Prisma.Decimal}});
    },
    addCandidateStock(name, amount) {
        const user = get().user!;
        set({
            user: {
                ...user,
                Stock: user.Stock.map(stock => stock.candidateName === name ? {
                    ...stock,
                    amount: stock.amount + amount
                } : stock)
            }
        });
    }
}))