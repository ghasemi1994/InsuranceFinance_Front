export interface ICategoryResponse {
    id: number
    name: string,
    code: string,
    feePercentage: number,
}

export interface IUpdateCategoryFeeRquest {
    id: number,
    feePercentage: number,
}

