import { DepositWallet } from "../../types/Wallet";
import http from "../http";


const depositWallet = async (req: DepositWallet, files: File[] | null) => {
    const formData = new FormData();

    if (req.depositRequest) {
        req.depositRequest.files = files; // Assign the files to depositRequest
    }

    // Append basic fields
    formData.append('depositMethodType', req.depositRequest?.depositMethodType?.toString() || '');
    formData.append('amount', req.depositRequest?.amount?.toString() || '');
    formData.append('paymentDate', req.depositRequest?.paymentDate || '');
    formData.append('targetBankAccountId', req.depositRequest?.targetBankAccountId?.toString() || '');
    formData.append('transactionId', req.depositRequest?.transactionId || '');
    formData.append('receivedBy', req.depositRequest?.receivedBy || '');
    formData.append('chequeDueDate', req.depositRequest?.chequeDueDate || '');
    formData.append('chequeBankName', req.depositRequest?.chequeBankName || '');
    formData.append('chequeNumber', req.depositRequest?.chequeNumber || '');
    formData.append('chequeAccountNumber', req.depositRequest?.chequeAccountNumber || '');
    formData.append('chequeAccountOwner', req.depositRequest?.chequeAccountOwner || '');
    formData.append('description', req.depositRequest?.description || '');

    // If there are files, append each file to formData
    if (req.depositRequest?.files) {
        req.depositRequest.files.forEach(file => {
            formData.append('files', file);
        });
    }

    // Send the form data in the POST request
    const { data } = await http.post(`/finance/api/wallet/deposit/${req.personId}`, formData);

    return data;
}


const getBalance = async (personId: number) => {
    const { data } = await http.get(`/finance/api/wallet/get-balance/${personId}`);
    return data
}


const getTransactionByPersonId = async (personId: number) => {
    const { data } = await http.get(`/finance/api/wallet/get-transaction-list/${personId}`);
    return data
}


export {
    depositWallet,
    getBalance,
    getTransactionByPersonId
}