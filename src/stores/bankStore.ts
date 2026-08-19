import { create } from "zustand";
import { ICompanyResponse } from "../types/Company";
import { getCompanyList } from "../server/services/companyService";
import { IBankAccount } from "../types/BankAccount";
import { getBankAccountList, getBankList } from "../server/services/bankService";
import { IBankResponse } from "../types/Bank";

interface initialState {

    account: {
        status: 'idle' | 'loading' | 'success' | 'error';
        errorData: string | null,
        dataList: IBankAccount[] | null,
    }

    bank: {
        status: 'idle' | 'loading' | 'success' | 'error';
        errorData: string | null,
        dataList: IBankResponse[] | null,
    }
};

type storeActions = {
    getAccountList: () => Promise<void>,
    getBankList: () => Promise<void>,
}

export const useBankStore = create<initialState & storeActions>((set) => ({
    account: {
        dataList: [],
        errorData: null,
        status: 'idle'
    },
    bank: {
        dataList: [],
        errorData: null,
        status: 'idle'
    },


    getAccountList: async () => {
        set({ account: { status: 'loading', dataList: null, errorData: null } });
        try {
            const { data } = await getBankAccountList();
            set({ account: { status: 'success', dataList: data, errorData: null } });
        } catch (err: any) {
            set({ account: { status: 'error', dataList: null, errorData: err.message } });
        }
    },

    getBankList: async () => {
        set({ bank: { status: 'loading', dataList: null, errorData: null } });
        try {
            const { data } = await getBankList();
            set({ bank: { status: 'success', dataList: data, errorData: null } });
        } catch (err: any) {
            set({ bank: { status: 'error', dataList: null, errorData: err.message } });
        }
    },
}));