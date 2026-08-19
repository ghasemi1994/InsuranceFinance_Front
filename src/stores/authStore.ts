import { create } from "zustand";
import { getUserInfo } from "../server/services/authenticateService";
import { IUserInfo } from "../types/User";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    userInfo: IUserInfo | null,
    getUserInfo: () => Promise<void>

};


export const useAuthStore = create<initialState>((set) => ({
    status: 'idle',
    errorData: null,
    dataList: [],
    userInfo: null,

    getUserInfo: async () => {
        set({ status: 'loading', errorData: null, userInfo: null });
        try {
            const { data } = await getUserInfo();
            set({ status: 'success', errorData: null, userInfo: data });
        } catch (err: any) {
            set({ status: 'error', userInfo: null, errorData: err.message });
        }
    },
}));