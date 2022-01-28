import create from 'zustand';
import {Prisma, User} from '@prisma/client';

export const useUserStore = create<{
    setPoints: (points: number) => any;
    addCandidateStock: (name: string, stock: number) => any,
    user: (User & { Stock: { amount: number, candidateName: string }[] }) | null,
    loading: boolean,
    loaded: boolean,
    load: () => void,
}>((set, get) => ({
    user: null,
    loading: false,
    loaded: false,
    load() {
        if (get().loading || get().loaded) return;
        set({loading: true});
        fetch('/api/intern/user').then(response => response.json())
            .then(({user}) => set({user, loaded: true, loading: false}));
    },
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