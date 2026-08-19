import { create } from "zustand";
import { IInsurancePolicyRequest, IInsurancePolicyResponse, InsurancePolicyFilter } from "../types/Insurance";
import { createInsurancePolicy, getInsurancePolicyList } from "../server/services/insuranceService";
import { IFormFieldValue } from "../types/Form";

interface InitialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null;
    formStep: number;
    formData: Partial<IInsurancePolicyRequest>;
    /** اطلاعات ثبت شده */
    dataList?: Array<IInsurancePolicyResponse> | null;
    shouldUpdateFields: boolean;
    filter: InsurancePolicyFilter,

    dataForEdit: IInsurancePolicyResponse | null,
}

type StoreActions = {
    setFormStep: (step: number) => void;
    setFormData: (item: Partial<IInsurancePolicyRequest>) => void;
    resetFormData: () => void;
    create: (item: IInsurancePolicyRequest, formFieldValues?: IFormFieldValue[]) => Promise<any>;
    /** خواندن لیست ثبت شده ها */
    getList: () => Promise<void>;
    setFilter: (newFilter: Partial<InsurancePolicyFilter>) => void;

    setDataForEdit: (data: IInsurancePolicyResponse | null) => void
};

export const useInsurancePolicyStore = create<InitialState & StoreActions>((set, get) => ({
    status: 'idle',
    errorData: null,
    formStep: 0,
    formData: {},
    shouldUpdateFields: true,
    filter: {
        nationalCode: '',
        categoryId: null,
        personId: null,
        insuranceNo: '',
        introducerId: null,
        marketerId: null
    },
    dataForEdit: null,

    setDataForEdit: (data: IInsurancePolicyResponse | null) => {
        if (data) {
            set((state) => ({
                dataForEdit: { ...state.dataForEdit, ...data },
            }));
        }
    },

    create: async (item, formFieldValues) => {
        set({ status: 'loading', errorData: null });
        try {
            const response = await createInsurancePolicy(item, formFieldValues);
            set({ status: 'success', errorData: null });
            return response;
        } catch (err: any) {
            set({ status: 'error', errorData: err.message });
            throw err;
        }
    },
    setFilter: (newFilter) => {
        set((state) => ({
            filter: { ...state.filter, ...newFilter },
        }));
    },

    getList: async () => {
        const { filter } = get();
        set({ status: 'loading', dataList: null, errorData: null });
        try {
            const { data } = await getInsurancePolicyList(filter);
            set({ status: 'success', dataList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', dataList: null, errorData: err.message });
        }
    },

    setFormStep: (step) => set({ formStep: step }),

    setFormData: (item) =>
        set((state) => ({
            formData: { ...state.formData, ...item },
        })),

    resetFormData: () => set({
        formData: {},
        formStep: 0,
    }),
}));
