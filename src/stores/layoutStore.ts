import { create } from "zustand";


interface initialState {
    drawerOpen: boolean;
};
interface StoreActions {
    setDrawerOpen: (open: boolean) => void

}

export const useLayoutStore = create<initialState & StoreActions>((set) => ({
    drawerOpen: true,
    setDrawerOpen(open) {
        set({ drawerOpen: open });
    },

}));