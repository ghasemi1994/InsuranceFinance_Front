import { ICreateInsurancePolicyFormRequest, IFormFieldPolicyRequest } from '../../types/Form';
import http from '../http';

const createForm = async (request: ICreateInsurancePolicyFormRequest) => {
    const { data } = await http.post('/finance/api/form/create', request);
    return data;
}

const getFormList = async () => {
    const { data } = await http.get('/finance/api/form/get-list');
    return data;
}

const getFormByCategoryId = async (categoryId: number) => {
    const { data } = await http.get(`/finance/api/form/get-form/${categoryId}`);
    return data;
}

const deleteFormField = async (formId: number, fieldId: number) => {
    const { data } = await http.delete(`/finance/api/form/delete-field/${formId}/${fieldId}`);
    return data;
}

const createField = async (formId: number, field: IFormFieldPolicyRequest) => {
    const { data } = await http.post(`/finance/api/form/create-field/${formId}`, field);
    return data;
}

const getFieldByFormIdList = async (formId: number) => {
    const { data } = await http.get(`/finance/api/form/get-field-list/${formId}`);
    return data;
}

const updateField = async (formId: number, field: IFormFieldPolicyRequest) => {
    const { data } = await http.put(`/finance/api/form/update-field/${formId}`, field);
    return data;
}

const deleteForm = async (formId: number) => {
    const { data } = await http.delete(`/finance/api/form/delete/${formId}`);
    return data;
}

export {
    createForm,
    getFormList,
    getFormByCategoryId,
    deleteFormField,
    createField,
    updateField,
    getFieldByFormIdList,
    deleteForm
}