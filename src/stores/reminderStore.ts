import { getReminderCategoryDetail, getReminderCategoryList } from "@/server/services/reminderService";
import { ReminderCategory } from "@/types/Enums";
import { ReminderCategoryDetailResponse, ReminderCategoryResponse, ReminderDetailResponse } from "@/types/Reminder";
import { create } from "zustand";


interface initialState {

    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    reminderCategoryList: ReminderCategoryResponse[],

    reminderCategoryDetail: ReminderDetailResponse | null,
    detailStatus: 'idle' | 'loading' | 'success' | 'error';
}

type StoreActions = {
    getReminderCategoryList: () => void
    getReminderCategoryDetail: (category: ReminderCategory) => void
}


export const useReminderStore = create<initialState & StoreActions>((set, get) => ({

    status: 'idle',
    errorData: null,
    reminderCategoryList: [],

    detailStatus: 'idle',
    reminderCategoryDetail: null,

    getReminderCategoryList: async () => {
        set({ status: 'loading', reminderCategoryList: [], errorData: null });
        try {
            const { data } = await getReminderCategoryList();
            set({ status: 'success', reminderCategoryList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', reminderCategoryList: [], errorData: err.message });
        }
    },

    getReminderCategoryDetail: async (category: ReminderCategory) => {
        set({ detailStatus: 'loading', reminderCategoryDetail: null, errorData: null });
        try {
            const { data } = await getReminderCategoryDetail(category);
            set({ detailStatus: 'success', reminderCategoryDetail: data, errorData: null });
        } catch (err: any) {
            set({ detailStatus: 'error', reminderCategoryDetail: null, errorData: err.message });
        }
    }


}));
