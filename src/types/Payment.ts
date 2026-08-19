import { IAttachmentResponse } from "./Attachment";
import { PaymentType } from "./Enums";
import { InstallmentSideType, PolicyPaymentGroupType } from "./Insurance";
import { DepositRequest } from "./Wallet";


export interface PolicyPaymentPendingDebtResponse {
    id: number
    amount: number
}

export interface IPolicyPaymentResponse {
    id: number;
    dueTitle: string;
    paymentDate: string;
    depositMethodTypeTitle: string;
    discount: number,
    amount: number,
    description: string
    attachments: IAttachmentResponse[],
    totalAmount: number
}


export interface IPolicyPaymentRequest {
    payerPersonId: number | null;
    insurancePolicyId: number | null;
    policyInstallmentItemId: number | null;
    newInstallmentStartDate: Date | null | string;
    description: string | null;
    depositRequest: DepositRequest | null,
    depositRequestJson: string | null,
    sideType: InstallmentSideType,
    policyPaymentOption: PolicyPaymentOption | null,
    addendumId: number | null,
    policyPaymentPendingDebtId: number | null,
    policyPaymentGroupTypeId: PolicyPaymentGroupType
    files: File[],
    lifeInsuranceYear: number | null
}



export interface IGroupPolicyPaymentRequest {
    payerPersonId: number | null
    insurancePolicyId: number | null;
    policyInstallmentItemId: number[] | null;
    description: string | null
    paymentDate: string | null
}



export interface IPolicyWithInstallmentDetailResponse {
    id: number;
    customerName: string;
    nationalCode: string;
    categoryTitle: string;
    paymentTypeId: PaymentType;
    paymentTypeTitle: string;
    totalAmount: number | null;
    installmentItemId: number | null;
    dueTitle: string;
    dueAmount: number | null;
    dueDate: string;
    isPaid: boolean;
    installmentNumber: number;
    isPrePayment: boolean
}

export enum PolicyPaymentOption {
    None,
    NewInstallment,
    Discount,
    Debt
}