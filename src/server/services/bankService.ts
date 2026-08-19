
import { IBankAccount } from '../../types/BankAccount';
import http from '../http';

const baseApiUrl = "/finance/api/bank";

const createBankAccount = async (request: IBankAccount) => {
    const { data } = await http.post(`${baseApiUrl}/create-account`, request);
    return data;
}

const getBankAccountList = async () => {
    const { data } = await http.get(`${baseApiUrl}/get-account-list`);
    return data;
}

const updateBankAccount = async (request: IBankAccount) => {
    const { data } = await http.put(`${baseApiUrl}/update-account`, request);
    return data;
}

const getBankList = async () => {
    const { data } = await http.get(`${baseApiUrl}/get-bank-list`);
    return data;
}

export {
    createBankAccount,
    getBankAccountList,
    updateBankAccount,
    getBankList
}