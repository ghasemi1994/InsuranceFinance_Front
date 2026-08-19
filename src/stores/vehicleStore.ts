import { create } from "zustand";
import { IVehicleTypeResponse } from "../types/Vehicle";
import { getVehicleType } from "../server/services/vehicleService";

interface initialState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errorData: string | null,
    vehicleTypeList: IVehicleTypeResponse[] | null,
    getVehicleTypeList: () => Promise<void>,
};


export const useVehicleStore = create<initialState>((set) => ({
    status: 'idle',
    errorData: null,
    vehicleTypeList: [],

    getVehicleTypeList: async () => {
        set({ status: 'loading', vehicleTypeList: null, errorData: null });
        try {
            const { data } = await getVehicleType();
            set({ status: 'success', vehicleTypeList: data, errorData: null });
        } catch (err: any) {
            set({ status: 'error', vehicleTypeList: null, errorData: err.message });
        }
    },

    
}));