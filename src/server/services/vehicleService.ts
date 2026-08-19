
import { ICreateBrand, ICreateVehicleTip } from '@/types/Vehicle';
import http from '../http';



const getVehicleType = async () => {
    const { data } = await http.get('/finance/api/vehicle/get-type-list');
    return data;
}

const getVehicleTypeUsage = async (vehicleTypeId: number) => {
    const { data } = await http.get(`/finance/api/vehicle/get-usage-list/${vehicleTypeId}`);
    return data;
}

const getVehicleTypeBrand = async (vehicleTypeId: number) => {
    const { data } = await http.get(`/finance/api/vehicle/get-brand-list/${vehicleTypeId}`);
    return data;
}

const getVehicleTypeModel = async (vehicleTypeId: number, vehicleTypeBrandId: number) => {
    const { data } = await http.get(`/finance/api/vehicle/get-model-list/${vehicleTypeId}/${vehicleTypeBrandId}`);
    return data;
}

const createVehicleTip = async (req: ICreateVehicleTip) => {
    const { data } = await http.post(`/finance/api/vehicle/create-vehicle-tip`, req);
    return data;
}

const createBrand = async (req: ICreateBrand) => {
    const { } = await http.post('/finance/api/vehicle/create-brand', req);
}

export {
    getVehicleType,
    getVehicleTypeUsage,
    getVehicleTypeBrand,
    getVehicleTypeModel,
    createVehicleTip,
    createBrand
}