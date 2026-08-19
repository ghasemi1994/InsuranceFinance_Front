import { create } from "zustand";
import { FinanceOverviewResponse } from "../types/Report";
import { getOverview } from "../server/services/reportService";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null;
    overviewData: FinanceOverviewResponse | null; // حواستان به حروف بزرگ/کوچک باشد!
};

type StoreActions = {
    getOverviewData: () => Promise<void>;
};

export const useReportStore = create<initialState & StoreActions>((set) => ({
    status: 'idle',
    errorData: null,
    overviewData: null, // نام متغیر باید دقیقاً مثل initialState باشد

    getOverviewData: async () => {
        set({ status: 'loading', overviewData: null, errorData: null });
        try {
            const { data } = await getOverview();
            set({ status: 'success', overviewData: data, errorData: null });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            set({ status: 'error', overviewData: null, errorData: errorMessage });
        }
    },
}));