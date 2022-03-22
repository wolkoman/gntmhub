import {StoreApi, UseBoundStore} from 'zustand';
import {EqualityChecker, State, StateSelector} from 'zustand/vanilla';

export type LoadingStore<T> = T & LoadingStoreAdds;
interface LoadingStoreAdds {
    loading: boolean;
    loaded: boolean;
    load:() => void
}

export const load = <EntityType>(set: (partial: any) => void, get: () => LoadingStoreAdds, api: string, reload?: boolean): LoadingStoreAdds => ({
    loading: false,
    loaded: false,
    load() {
        console.log("LOAD ", api)
        if (get().loading || (get().loaded && !reload)) return;
        set({loading: true});
        fetch(api).then(response => response.json())
            .then((entity) => set({...entity, loaded: true, loading: false}))
            .catch(() => set({loading: false}));
    }
})


export const autoload = <T extends {load: () => void},U extends Array<any>>(select: (store: T) => U): ((store: T) => U) => {
    return (x) => {
        x.load();
        return select(x);
    };
}