import { InstallmentSideType, PolicyPaymentGroupType } from '../../types/Insurance';
import { IGroupPolicyPaymentRequest, IPolicyPaymentRequest, PolicyPaymentOption } from '../../types/Payment';
import http from '../http';

const deleteByPaymentId = async (paymentId: number) => {
    const { data } = await http.delete(`/finance/api/payment/delete-payment/${paymentId}`);
    return data
}


const singlePolicyPayment = async (req: IPolicyPaymentRequest) => {
    const formData = new FormData();
    formData.append('addendumId', req.addendumId?.toString() ?? '')
    formData.append('payerPersonId', req.payerPersonId?.toString() ?? '');
    formData.append('insurancePolicyId', req.insurancePolicyId?.toString() ?? '');
    formData.append('policyInstallmentItemId', req.policyInstallmentItemId?.toString() ?? '');
    formData.append('newInstallmentStartDate', req.newInstallmentStartDate?.toLocaleString() ?? '');
    formData.append('description', req.description ?? '');
    formData.append('sideType', req.sideType.toString());
    formData.append('policyPaymentOption', req.policyPaymentOption?.toString() ?? PolicyPaymentOption.None.toString());
    formData.append('policyPaymentGroupTypeId', req.policyPaymentGroupTypeId.toString());
    formData.append('policyPaymentPendingDebtId', req.policyPaymentPendingDebtId?.toString() ?? '');
    formData.append('lifeInsuranceYear', req.lifeInsuranceYear?.toString() ?? '');

    if (req.depositRequest) {
        formData.append('depositRequestJson', JSON.stringify(req.depositRequest));
    }

    req.files?.forEach(file => {
        formData.append('files', file);
    });

    const { data } = await http.post('/finance/api/payment/single-payment', formData);

    return data;
};


const groupPolicyPayment = async (req: IGroupPolicyPaymentRequest) => {
    const { data } = await http.post('/finance/api/payment/group-payment', req);
    return data
}

const getPolicyPayment = async (
    sideType: InstallmentSideType,
    groupType: PolicyPaymentGroupType,
    insurancePolicyId: number,
    installmentItemId: number | null,
    addendumId: number | null
) => {
    const params = {
        sideType,
        groupType,
        insurancePolicyId,
        addendumId,
        ...(installmentItemId !== null && { installmentItemId })
    };

    const { data } = await http.get(`/finance/api/payment/get-payment`, { params });
    return data;
}

const getPaytmentDebtById = async (id: number) => {
    const { data } = await http.get(`/finance/api/payment/get-debt/${id}`);
    return data;
}

export {
    singlePolicyPayment,
    groupPolicyPayment,
    getPolicyPayment,
    deleteByPaymentId,
    getPaytmentDebtById
}