import { create } from "zustand";
import { IAttachmentResponse, IAttachmentTypeResponse } from "../types/Attachment";
import { changeAttachmentTypeStatus, getAttachmentListByEntity, getAttachmentTypeList } from "../server/services/attachmentService";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    dataTypeList: IAttachmentTypeResponse[] | null,
    attachmentList: IAttachmentResponse[] | null
};

type storeActions = {
    getTypeList: () => Promise<void>,
    getAttachmentList: (entityType: string, entityId: number) => Promise<void>,
    toggleStatus: (id: number) => Promise<void>;

}


export const useAttachmentStore = create<initialState & storeActions>((set) => ({
    status: 'idle',
    errorData: null,
    dataTypeList: [],
    attachmentList: [],

    getTypeList: async () => {
        set({ status: 'loading', dataTypeList: null, errorData: null });
        try {
            const { data } = await getAttachmentTypeList();
            set({ status: 'success', dataTypeList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', dataTypeList: null, errorData: err.message });
        }
    },
    toggleStatus: async (id: number) => {
        try {
            set(state => ({
                dataTypeList: state.dataTypeList?.map(item =>
                    item.id === id ? { ...item, isActive: !item.isActive } : item
                ) || null
            }));
            await changeAttachmentTypeStatus(id);
        } catch (err: any) {
            set(state => ({
                dataList: state.dataTypeList?.map(item =>
                    item.id === id ? { ...item, isActive: !item.isActive } : item
                ) || null,
                errorData: err.message
            }));
        }
    },
    getAttachmentList: async (entityType: string, entityId: number) => {
        set({ status: 'loading', attachmentList: null, errorData: null });
        try {
            const { data } = await getAttachmentListByEntity(entityType, entityId);
            set({ status: 'success', attachmentList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', attachmentList: null, errorData: err.message });
        }
    },
}));