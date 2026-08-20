import { create } from "zustand";

interface OnlineUsersState {
    count: number;
    setCount: (count: number) => void;
}

export const useOnlineUsersStore = create<OnlineUsersState>((set) => ({
    count: 0,

    setCount: (count) => set({ count }),
}));