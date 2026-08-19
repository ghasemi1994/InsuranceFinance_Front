import { create } from "zustand";
import { devtools } from 'zustand/middleware';
import { ICreateInsurancePolicyFormRequest, IFormFieldValue, IFormPolicyResponse, IInsurancePolicyFormField } from "../types/Form";
import { createForm, getFormList } from "../server/services/formService";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    dataList: IFormPolicyResponse[] | null,
    formData: ICreateInsurancePolicyFormRequest | null
    formFields: IInsurancePolicyFormField[]
    /** برای ثبت مقادیر فرم استفاده می شود */
    formFieldValues: IFormFieldValue[],

    currentFormByCategory: IFormPolicyResponse | null
};

interface StoreActions {
    create: (item: ICreateInsurancePolicyFormRequest) => Promise<any>
    getList: () => Promise<void>,
    setFormData: (item: ICreateInsurancePolicyFormRequest) => void;
    addFormField: () => void;
    removeFormField: (index: number) => void;
    updateFormField: (index: number, field: IInsurancePolicyFormField) => void;
    resetFormData: () => void;

    /** برای ثبت مقادیر فرم استفاده می شود */
    setFormFieldValue: (item: IFormFieldValue) => void
    resetFormFieldValue: () => void;

    setCurrentFormByCategory: (form: IFormPolicyResponse | null) => void;

}

export const useFormStore = create<initialState & StoreActions>()(
    devtools(
        (set) => ({
            status: 'idle',
            errorData: null,
            dataList: [],
            formData: {
                assignToCategoryId: null,
                description: null,
                fields: null,
                title: null,
            },
            formFields: [],
            formFieldValues: [],
            currentFormByCategory: null,

            setCurrentFormByCategory: (form: IFormPolicyResponse | null) =>
                set(() => ({
                    currentFormByCategory: form
                })),

            setFormFieldValue: (item) => set((state) => {
                const exists = state.formFieldValues.find(f => f.id === item.id);
                if (exists) {
                    return {
                        formFieldValues: state.formFieldValues.map(f =>
                            f.id === item.id ? { ...f, ...item } : f
                        ),
                    };
                }
                return { formFieldValues: [...state.formFieldValues, item] };
            }),

            resetFormFieldValue: () => set(() => ({
                formFieldValues: []
            })),

            resetFormData: () => set({
                formData: {
                    title: '',
                    description: '',
                    assignToCategoryId: null,
                    fields: null,
                },
                formFields: [],
            }),

            create: async (item) => {
                set({ status: 'loading', errorData: null });
                try {
                    await createForm(item);
                    set({ status: 'success', errorData: null });
                } catch (err: any) {
                    set({ status: 'error', errorData: err.message });
                    throw err;
                }
            },

            getList: async () => {
                set({ status: 'loading', dataList: null, errorData: null });
                try {
                    const { data } = await getFormList();
                    set({ status: 'success', dataList: data, errorData: null });
                } catch (err: any) {
                    set({ status: 'error', dataList: null, errorData: err.message });
                }
            },

            setFormData: (item) => set((state) => ({
                ...state,
                formData: { ...state.formData, ...item }
            })),

            addFormField: () => set((state) => ({
                formFields: [...state.formFields, { isRequired: true, displayOrder: 1 }]
            })),

            removeFormField: (index) => set((state) => ({
                formFields: state.formFields.filter((_, i) => i !== index)
            })),

            updateFormField: (index, field) => set((state) => {
                const newFields = [...state.formFields];
                newFields[index] = { ...newFields[index], ...field };
                return { formFields: newFields };
            }),
        }),
        { name: 'form-store', enabled: process.env.NODE_ENV === 'development' }
    )
);
