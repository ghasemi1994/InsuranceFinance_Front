
import { IFormFieldValue } from '../../types/Form';
import {
    AddendumRequest,
    IInstallmentCalculationRequest,
    IInsurancePolicyRequest,
    InstallmentSideType,
    InsurancePolicyFilter
} from '../../types/Insurance';
import http from '../http';

const getInstallmentCalculated = async (req: IInstallmentCalculationRequest) => {
    const { data } = await http.post(`/finance/api/installment/get-installment-calculated`, req);
    return data;
}

const getPolicyInstallment = async (policyId: number, sideType: InstallmentSideType, year: number | null, addendumId: number | null) => {

    const params = new URLSearchParams();

    params.append("sideType", sideType.toString());

    if (year)
        params.append("year", year.toString());

    if (addendumId)
        params.append("addendumId", addendumId.toString());

    const { data } = await http.get(`/finance/api/installment/get-installment/${policyId}?${params}`);
    return data;
}

const getPolicyInstallmentByItemId = async (installmentItemId: number) => {
    const { data } = await http.get(`/finance/api/installment/get-p-installment/${installmentItemId}`);
    return data;
}

const createInsurancePolicy = async (request: IInsurancePolicyRequest, formFieldValues?: IFormFieldValue[]) => {

    if (request.introducerPersonId === 0)
        request.introducerPersonId = null;

    const formData = new FormData();
    // اضافه کردن request به عنوان JSON
    formData.append('request', JSON.stringify(request));

    // اضافه کردن formFieldValues اگر وجود دارد
    if (formFieldValues && formFieldValues.length > 0) {
        formFieldValues.forEach((field, index) => {
            formData.append(`formFieldValues[${index}].id`, field.id.toString());
            formData.append(`formFieldValues[${index}].value`, field.value || '');

            if (field.file) {
                formData.append(`formFieldValues[${index}].file`, field.file);
            }
        });
    }

    const { data } = await http.post('/finance/api/insurance/create-insurance-policy', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};


const getInsurancePolicyListUrlParams = (filter: InsurancePolicyFilter): URLSearchParams => {
    const params = new URLSearchParams();

    if (filter.introducerId) {
        params.append("introducerId", filter.introducerId.toString());
    }
    if (filter.marketerId) {
        params.append("marketerId", filter.marketerId.toString());
    }
    if (filter.nationalCode) {
        params.append("nationalCode", filter.nationalCode);
    }
    if (filter.insuranceNo) {
        params.append("insuranceNo", filter.insuranceNo);
    }
    if (filter.categoryId != null) {   // فقط وقتی مقدار داشت
        params.append("categoryId", filter.categoryId.toString());
    }
    if (filter.personId != null) {
        params.append("personId", filter.personId.toString());
    }
    return params;
}

const getInsurancePolicyList = async (filter: InsurancePolicyFilter) => {
    const { data } = await http.get(`/finance/api/insurance/get-policy-list?${getInsurancePolicyListUrlParams(filter).toString()}`);
    return data;
};

const getInsurancePolicyExcelData = async (filter: InsurancePolicyFilter) => {
    const { data } = await http.get(`/finance/api/insurance/export-policy-list-excel?${getInsurancePolicyListUrlParams(filter).toString()}`);
    return data;
};



const getFormWithValueByPolicyId = async (policyId: number) => {
    const { data } = await http.get(`/finance/api/insurance/get-form-value/${policyId}`);
    return data;
}
const getPolicyListByObligorsPersonToPay = async (obligatorPersonId: number) => {
    const { data } = await http.get(`/finance/api/insurance/get-policy-list/${obligatorPersonId}`);
    return data;
}
const getPolicyWithInstallmentDetail = async (obligatorPersonId: number) => {
    const { data } = await http.get(`/finance/api/insurance/get-policy/${obligatorPersonId}`);
    return data;
}
const getInstallmentPrintData = async (policyId: number) => {
    const { data } = await http.get(`/finance/api/installment/get-installment-print-data/${policyId}`);
    return data;
}
const getPolicyById = async (policyId: number, sideType: InstallmentSideType) => {
    const { data } = await http.get(`/finance/api/insurance/get-policy/${policyId}?sideType=${sideType}`);
    return data;
}
const getPolicyByInsuranceNo = async (insuranceNo: string) => {
    const { data } = await http.get(`/finance/api/insurance/get-policy?insuranceNo=${insuranceNo}`);
    return data;
}

const createAddendum = async (request: AddendumRequest) => {

    const formData = new FormData();

    if (request.files) {
        request.files.forEach(file => {
            formData.append('files', file);
        });
    }

    formData.append('policyId', request.policyId?.toString() ?? '');
    formData.append('addendumNo', request.addendumNo?.toString() ?? '');
    formData.append('addendumType', request.addendumType?.toString() ?? '');
    formData.append('fullDescription', request.fullDescription ?? '');
    formData.append('shortDescription', request.shortDescription ?? '');
    formData.append('issuedDate', request.issuedDate ?? '');
    formData.append('premiumChangeAmount', request.premiumChangeAmount?.toString() ?? '0');
    formData.append('customerPaymentType', request?.customerPaymentType?.toString() ?? '');
    formData.append('insurancePaymentType', request?.insurancePaymentType?.toString() ?? '');

    formData.append('customerSideInstallment.prePaymentType', request?.customerSideInstallment?.prePaymentType?.toString() ?? '');
    formData.append('customerSideInstallment.prePaymentValue', request?.customerSideInstallment?.prePaymentValue?.toString() ?? '');
    formData.append('customerSideInstallment.intervalBetweenInstalment', request?.customerSideInstallment?.intervalBetweenInstalment?.toString() ?? '');
    formData.append('customerSideInstallment.prePaymentStartDate', request?.customerSideInstallment?.prePaymentStartDate?.toString() ?? '');
    formData.append('customerSideInstallment.installmentStartDate', request?.customerSideInstallment?.installmentStartDate?.toString() ?? '');
    formData.append('customerSideInstallment.installmentCount', request?.customerSideInstallment?.installmentCount?.toString() ?? '');
    formData.append('customerSideInstallment.installmentAmount', request?.customerSideInstallment?.installmentAmount?.toString() ?? '');

    formData.append('insuranceSideInstallment.prePaymentType', request?.insuranceSideInstallment?.prePaymentType?.toString() ?? '');
    formData.append('insuranceSideInstallment.prePaymentValue', request?.insuranceSideInstallment?.prePaymentValue?.toString() ?? '');
    formData.append('insuranceSideInstallment.intervalBetweenInstalment', request?.insuranceSideInstallment?.intervalBetweenInstalment?.toString() ?? '');
    formData.append('insuranceSideInstallment.prePaymentStartDate', request?.insuranceSideInstallment?.prePaymentStartDate?.toString() ?? '');
    formData.append('insuranceSideInstallment.installmentStartDate', request?.insuranceSideInstallment?.installmentStartDate?.toString() ?? '');
    formData.append('insuranceSideInstallment.installmentCount', request?.insuranceSideInstallment?.installmentCount?.toString() ?? '');
    formData.append('insuranceSideInstallment.installmentAmount', request?.insuranceSideInstallment?.installmentAmount?.toString() ?? '');


    const { data } = await http.post('/finance/api/addendum/create-addendum', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

const getAddendumListByPolicyId = async (policyId: number) => {
    const { data } = await http.get(`/finance/api/addendum/get-addendum-list/${policyId}`);
    return data;
}

const getAddendumList = async (personId: number | null) => {

    const params = new URLSearchParams();

    if (personId)
        params.append("personId", personId.toString());

    const { data } = await http.get(`/finance/api/addendum/get-addendum-list?${params}`);
    return data;
}

const deleteAddendum = async (policyId: number, addendumId: number) => {
    const { data } = await http.delete(`/finance/api/addendum/delete-addendum/${policyId}/${addendumId}`);
    return data;
}

const getAddendumById = async (addendumId: number) => {
    const { data } = await http.get(`/finance/api/addendum/get-addendum/${addendumId}`);
    return data;
}

const checkInsuranceNo = async (id: number | null, insuranceNo: string) => {
    const params = new URLSearchParams();

    if (id)
        params.append("id", id.toString());

    params.append('insuranceNo', insuranceNo);

    const { data } = await http.get(`/finance/api/insurance/check-insurance-no?${params}`);
    return data;
}

const deleteById = async (id: number) => {
    const { data } = await http.delete(`/finance/api/insurance/delete/${id}`);
    return data;
}

export {
    getInsurancePolicyList,
    createInsurancePolicy,
    getInstallmentCalculated,
    getFormWithValueByPolicyId,
    getPolicyInstallment,
    getPolicyListByObligorsPersonToPay,
    getPolicyWithInstallmentDetail,
    getInstallmentPrintData,
    getPolicyById,
    getPolicyByInsuranceNo,
    createAddendum,
    getAddendumListByPolicyId,
    getAddendumList,
    deleteAddendum,
    getAddendumById,
    getPolicyInstallmentByItemId,
    checkInsuranceNo,
    getInsurancePolicyExcelData,
    deleteById
}