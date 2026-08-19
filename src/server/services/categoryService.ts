
import { IUpdateCategoryFeeRquest } from '../../types/Category';
import http from '../http';


const getCategoryList = async () => {
    const { data } = await http.get('/finance/api/category/get-category-list');
    return data;
}

const updateFee = async (request: IUpdateCategoryFeeRquest) => {
    const { data } = await http.put('/finance/api/category/update-fee', request);
    return data;
}

const getCategoryById = async (id: number) => {
    const { data } = await http.get(`/finance/api/category/get-category/${id}`);
    return data;
}

export {
    getCategoryList,
    updateFee,
    getCategoryById
}