import { create } from "zustand";
import { getPersonById, getPersonList } from "../server/services/personService";
import { IPersonResponse, PersonGroupType } from "../types/Person";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    dataList: IPersonResponse[],

    person: IPersonResponse,
    personStatus: 'idle' | 'loading' | 'success' | 'error',

    dropdownList: IPersonResponse[],
    dropdownListStatus: 'idle' | 'loading' | 'success' | 'error',

    isFetchingDropdownList: boolean,  // اضافه شد
};

type StoreActions = {
    getList: (nationalCode: string, phoneNumber: string, fullName: string, id: number | null, groupType: PersonGroupType | null) => Promise<void>,
    getForDropdownList: () => Promise<void>,
    getPersonById: (id: number) => Promise<IPersonResponse>,
}

export const usePeopleStore = create<initialState & StoreActions>((set, get) => ({
    status: 'idle',
    errorData: null,
    dataList: [],
    person: {} as IPersonResponse,
    personStatus: 'idle',
    dropdownList: [],
    dropdownListStatus: 'idle',
    isFetchingDropdownList: false,  // مقدار اولیه

    getForDropdownList: async () => {
        // اگر درخواست در حال اجراست، زودتر بیرون برو
        if (get().isFetchingDropdownList) return;

        set({ dropdownListStatus: 'loading', dropdownList: [], errorData: null, isFetchingDropdownList: true });

        try {
            const { data } = await getPersonList('', '', '', null, null);
            set({ dropdownListStatus: 'success', dropdownList: data, errorData: null, isFetchingDropdownList: false });
        } catch (err: any) {
            set({ dropdownListStatus: 'error', dropdownList: [], errorData: err.message, isFetchingDropdownList: false });
        }
    },

    getList: async (nationalCode: string, phoneNumber: string, fullName: string, id: number | null, groupType: PersonGroupType | null = null) => {
        set({ status: 'loading', dataList: [], errorData: null });
        try {
            const { data } = await getPersonList(nationalCode, phoneNumber, fullName, id, groupType);
            set({ status: 'success', dataList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', dataList: [], errorData: err.message });
        }
    },

    getPersonById: async (id: number) => {
        set({ personStatus: 'loading', errorData: null });
        try {
            const { data } = await getPersonById(id);
            set({
                personStatus: 'success',
                person: data,
                errorData: null
            });
            return data;
        } catch (err: any) {
            set({
                personStatus: 'error',
                errorData: err.message
            });
            throw err;
        }
    }
}));
