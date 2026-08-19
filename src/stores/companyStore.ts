import { create } from "zustand";
import { ICompanyResponse } from "../types/Company";
import { getCompanyList } from "../server/services/companyService";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    dataList: ICompanyResponse[] | null,
    getList: () => Promise<void>,
};


export const useCompanyStore = create<initialState>((set) => ({
    status: 'idle',
    errorData: null,
    dataList: [],

    getList: async () => {
        set({ status: 'loading', dataList: null, errorData: null });
        try {
            const { data } = await getCompanyList();
            set({ status: 'success', dataList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', dataList: null, errorData: err.message });
        }
    },
}));