import { create } from "zustand";
import { getMarketerList } from "../server/services/personService";
import { IMarketerResponse } from "../types/Person";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    dataList: IMarketerResponse[] | null,
};

type StoreActions = {
    getList: () => Promise<void>,
}
export const useMarketerStore = create<initialState & StoreActions>((set) => ({
    status: 'idle',
    errorData: null,
    dataList: [],

    getList: async () => {
        set({ status: 'loading', dataList: null, errorData: null });
        try {
            const { data } = await getMarketerList();
            set({ status: 'success', dataList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', dataList: null, errorData: err.message });
        }
    },


}));