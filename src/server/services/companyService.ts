
import { ICompanyAgencyBankAccountRequest, ICompanyAgencyRequest, ICompanyRequest } from '../../types/Company';
import http from '../http';


const getCompanyList = async () => {
    const { data } = await http.get('/finance/api/company/get-company-list');
    return data;
}

const createCompanyAgency = async (request: ICompanyAgencyRequest) => {
    const { data } = await http.post('/finance/api/company/create-agency', request);
    return data;
}

const updateCompanyAgency = async (request: ICompanyAgencyRequest) => {
    const { data } = await http.post('/finance/api/company/update-agency', request);
    return data;
}

const getCompanyAgencyList = async (companyId: number) => {
    const { data } = await http.get(`/finance/api/company/get-agency-list/${companyId}`);
    return data;
}

const deleteAgency = async (id: number) => {
    const { data } = await http.get(`/finance/api/company/delete-agency/${id}`);
    return data;
}

const createCompany = async (company: FormData) => {
    const { data } = await http.post('/finance/api/company/create-company', company);
    return data;
}

const updateCompany = async (company: FormData) => {
    const { data } = await http.put('/finance/api/company/update-company', company);
    return data;
}

const createAgencyBankAccount = async (account: ICompanyAgencyBankAccountRequest) => {
    const { data } = await http.post('/finance/api/company/create-agency-account', account);
    return data;
}

const updateAgencyBankAccount = async (account: ICompanyAgencyBankAccountRequest) => {
    const { data } = await http.put('/finance/api/company/update-agency-account', account);
    return data;
}

const getAgencyBankAccount = async (companyAgencyId: number) => {
    const { data } = await http.get(`/finance/api/company/get-agency-account-list/${companyAgencyId}`);
    return data;
}



export {
    getCompanyList,
    createCompanyAgency,
    getCompanyAgencyList,
    deleteAgency,
    createCompany,
    updateCompany,
    updateCompanyAgency,
    createAgencyBankAccount,
    updateAgencyBankAccount,
    getAgencyBankAccount
}