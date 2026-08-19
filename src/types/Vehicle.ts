enum VehicleCategory {
    Tip = 1,
    Capacity = 2,
    Tonnage = 3
}

export interface IVehicleTypeResponse {
    id: number;
    title: string;
    vehicleCategoryId: VehicleCategory;
    vehicleCategoryTitle: string;
}

export interface IVehicleTypeUsageResponse {
    id: number;
    title: string;
}

export interface IVehicleTypeBrandResponse {
    id: number;
    title: string;
}

export interface IVehicleTypeModelResponse {
    id: number;
    title: string;
}



export interface ICreateVehicleTip {
    typeId: number | null,
    typeBrandId: number | null,
    tipName: string
}

export interface ICreateBrand {
    title: string,
    typeId: number
}   