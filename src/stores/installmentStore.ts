import { create } from "zustand";
import { IFinanceItem, IFinanceItemFilter, InstallmentSideType } from "../types/Insurance";
import { getFinanceItemExcelByte, getFinanceItemList } from "../server/services/reportService";
import { toPersianDate } from "@/utils/convertion";

interface InitialState {
    filter: IFinanceItemFilter;
    financeItems: {
        status: "idle" | "loading" | "success" | "error";
        dataList: IFinanceItem[];
        errorData: string | null;
    };
}

type StoreActions = {
    setFilter: (newFilter: Partial<IFinanceItemFilter>) => void;
    getFinanceItemList: () => Promise<void>;
};

export const useInstallmentStore = create<InitialState & StoreActions>((set, get) => ({
    filter: {
        dueStatus: 0,
        settlementStatus: 0,
        sideType: InstallmentSideType.Customer,
        dueType: 0,

    },

    financeItems: {
        dataList: [],
        status: "idle",
        errorData: null,
    },


    setFilter: (newFilter) => {
        set((state) => ({
            filter: { ...state.filter, ...newFilter },
        }));
    },

    getFinanceItemList: async () => {
        const { filter } = get();
        set({ financeItems: { status: "loading", dataList: [], errorData: null } });

        try {
            const { data } = await getFinanceItemList(filter);
            set({ financeItems: { status: "success", dataList: data, errorData: null } });
        } catch (err: any) {
            set({ financeItems: { status: "error", dataList: [], errorData: err.message } });
        }
    },


}));
