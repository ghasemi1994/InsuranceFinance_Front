import { create } from "zustand";
import { ICategoryResponse } from "../types/Category";
import { getCategoryList } from "../server/services/categoryService";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    dataList: ICategoryResponse[] | null,
    getList: () => Promise<void>,
};


export const useCategoryStore = create<initialState>((set) => ({
    status: 'idle',
    errorData: null,
    dataList: [],

    getList: async () => {
        set({ status: 'loading', dataList: null, errorData: null });
        try {
            const { data } = await getCategoryList();
            set({ status: 'success', dataList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', dataList: null, errorData: err.message });
        }
    },
}));