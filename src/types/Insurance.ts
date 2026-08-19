import { IAttachmentResponse } from "./Attachment"
import { FeeReceiverType, FeeCalculationType, InsuranceTermType, ObligatedToPayType, PaymentType, DueType } from "./Enums"
import { IFormFieldValue, IFormPolicyResponse } from "./Form"



export interface IPolicyInstallment {
    prePaymentType?: PrePaymentType
    prePaymentValue?: number | null
    intervalBetweenInstalment?: number | null
    prePaymentStartDate?: string | null
    installmentStartDate?: string | null
    installmentCount?: number | null;
    installmentAmount?: number | null
}

export interface IInsurancePolicyRequest {

    /** شناسه بیمه نامه ای که داریم تمدید میکنیم */
    currentPolicyRenewalId: number | null

    id?: number | null
    /** قسط با مشتری */
    customerSideInstallment?: IPolicyInstallment | null
    /**قسط با بیمه */
    insuranceSideInstallment?: IPolicyInstallment | null
    /**مقادیر فرم */
    formFieldValues?: IFormFieldValue[],
    formId?: number | null
    /**کد منحصر به فرد */
    uniqueCode?: number | null
    /**یادآوری تمدید */
    hasRenewalReminder?: boolean
    /**تعداد روز برای قبل انقضا */
    renewalReminderDay: number
    insuranceCompanyAgencyId_IssueUnit?: number,
    insuranceCompanyAgencyId_IntroducerUnit?: number
    introducerPersonId?: number | null
    insuranceTermTypeId?: InsuranceTermType
    insuranceTermValue?: number
    insuranceNo?: string
    personMarketerId?: number | null
    companyId?: number
    categoryId?: number,
    categoryCode?: string | null
    personId?: number | null
    issueDate?: string | null,
    insuranceStartDate?: string | null,
    discountAmount?: number | null
    obligatedToPayType?: ObligatedToPayType
    description?: string | null
    paymentType?: PaymentType,
    insurancePaymentType?: PaymentType,
    totalAmount?: number,

    customerFullName?: string,
    marketerFullName?: string,
    introducerFullName?: string

    feeReceiverType: FeeReceiverType,
    feeCalculationType: FeeCalculationType
    feePercentage: number,
    vatPercentage: number,
    cost: number,
    incentiveFeePercentage: number

    /**بیمه عمر و سرمایه */
    paymentFrequencyType: PaymentFrequencyType | null,
    lifeAdjustmentPercent: number,
    lifeInsuranceYear: number
}


export interface IInstallmentCalculatedResponse {
    prePaymentType: PrePaymentType
    prePaymentValue: number,
    description: string
    items: IInstallmentItemCalculatedResponse[]
}
export interface IInstallmentItemCalculatedResponse {
    dueDate: string;
    dueAmount: number;
    isPrePayment: boolean;
    installmentNumber: number
}



export interface IInstallmentCalculationRequest {
    totalAmount: number | null;
    prePaymentType: PrePaymentType | null
    prePaymentValue: number | null;
    installmentCount: number | null;
    intervalBetweenInstalment: number | null;
    installmentStartDate: string | null
    prePaymentStartDate: string | null,
    paymentFrequencyType?: PaymentFrequencyType | null,
    lifeAdjustmentPercent?: number,
    lifeInsuranceYear?: number,
    installmentAmount?: number | null
}

export interface IInsurancePolicyResponse {
    id: number
    customerName: string
    customerId: number
    nationalCode: string
    phoneNumber: string
    categoryTitle: string
    paymentTypeTitle: string
    paymentTypeId: number,
    insurancePaymentTypeTitle: string
    insurancePaymentTypeId: number
    totalAmount: number
    totalAmountPayable: number
    insuranceNo: string
    issueDate: string,
    insuranceStartDate?: string | null,
    formId: number | null,
    customerDepositStatusTitle: string
    customerDepositStatus: DepositStatus
    depositStatus: DepositStatus
    insuranceDepositStatusTitle: string
    insuranceDepositStatus: DepositStatus
    discountAmount: number,
    personMarketerId: number,
    introducerPersonId: number,
    categoryId: number,
    categoryCode: string,
    insuranceCompanyId: number,
    insuranceCompanyName: string,
    insuranceCompanyAgencyId_IssueUnit?: number,
    insuranceCompanyAgencyId_IntroducerUnit?: number
    insuranceCompanyAgencyName: string
    uniqueCode: string,
    insuranceTermTypeId: InsuranceTermType,
    insuranceTermTypeValue: number,
    hasRenewalReminder: boolean,
    renewalReminderDay: number
    obligatedToPayType: ObligatedToPayType,
    premiumChangeAmount: number,
    feeReceiverType: FeeReceiverType,
    feeCalculationType: FeeCalculationType
    feePercentage: number,
    vatPercentage: number,
    cost: number,
    incentiveFeePercentage: number
    customerInstallment: IPolicyInstallmentResponse //customer side
    insuranceInstallment: IPolicyInstallmentResponse // insurance side
    form: IFormPolicyResponse
    /**بیمه عمر و سرمایه */
    paymentFrequencyType: PaymentFrequencyType | null,
    lifeAdjustmentPercent: number,
    lifeInsuranceYear: number,
    addendums: AddendumResponse[]
}

export interface IPolicyInstallmentResponse {
    id: number;
    installmentCount: number;
    intervalBetweenInstalment: number;
    prePaymentTypeId?: PrePaymentType;
    prePaymentTypeTitle: string;
    prePaymentValue: number;
    prePaymentStartDate: string | null;
    installmentStartDate: string | null;
    installmentAmount?: number | null
    items: IPolicyInstallmentItemResponse[];
}

export interface IPolicyInstallmentItemResponse {
    id: number;
    dueAmount: number;
    dueDate: string;
    isPrePayment: boolean;
    isPaid: boolean,
    depositMethodTypeTitle: string
    installmentNumber: string
    dueTitle: string,
    paymentDate: string
    transactionId: string
    parentTransactionId: string
    discountAmount: number,
    numberOfDayLate: number
}

export interface IFinanceItem {
    installmentItemId: number | null,
    customerId: number,
    customerName: string,
    customerNationalCode: string,
    customerPhoneNumber: string
    dueAmount: number;
    dueDate: string;
    isPrePayment: boolean;
    isPaid: boolean,
    depositMethodTypeTitle: string
    installmentNumber: string
    dueTitle: string,
    paymentDate: string
    transactionId: string,
    isDueExpired: boolean,
    insurancePolicyId: number
    category: string,
    marketer: string
    sideType: InstallmentSideType,
    discountAmount: number,
    amountPayable: number,
    id: number,
    customId: string
    obligatedToPay: string,
    companyName: string
    companyAgnecyName: string,
    insuranceNo: string,
    paidDate: string,
    totalAmount: number,
    policyPaymentGroupType: PolicyPaymentGroupType,
    addendumId: number | null,
    policyPaymentPendingDebtId: number | null,
    introducerFullName: string

}

export interface IFinanceItemFilter {
    nationalCode?: string | null
    startDate?: string | null
    endDate?: string | null,
    dueStatus?: number | null
    settlementStatus?: number | null
    sideType?: InstallmentSideType,
    dueType?: DueType | null,
    personId?: number | null,
    marketerId?: number | null,
    startPaymentDate?: string | null,
    endPaymentDate?: string | null
}


export interface PolicyInstallmentPrintData {
    policyInstallment: IPolicyInstallmentResponse,
    customerName: string,
    customerNationalCode: string,
    customerPhoneNumber: string,
    category: string
    insuranceNo: string
    totalAmount: number
    totalPaid: number
    totalRemind: number
}

export interface InsurancePolicyFilter {
    nationalCode: string | null,
    categoryId: number | null,
    personId: number | null,
    insuranceNo: string,
    marketerId: number | null
    introducerId: number | null
}


/**وضعیت تسویه بیمه نامه */
export enum DepositStatus {
    Pending = 1,
    InProgress = 2,
    Debt = 3,
    Complete = 4
}


/** نوع پیش پرداخت */
export enum PrePaymentType {
    Amount = 1,
    Percentage = 2,
}

/**طرف حساب قسط */
export enum InstallmentSideType {
    Customer = 1,
    Insurance = 2
}

export enum PolicyPaymentGroupType {
    CashGroup = 1,
    InstallmentGroup = 2,
    AddendumGroup = 3,
    DebtGroup = 4
}

export enum AddendumType {
    WithFinancial = 1,       //با بار مالی
    WithoutFinance = 2,   // بدون بار مالی
    Cancellation = 3      // ابطال
}

export interface AddendumRequest {
    policyId: number | null
    addendumType: AddendumType | null,
    issuedDate: string | null,
    addendumNo: string | null
    shortDescription: string | null,
    fullDescription: string | null,
    premiumChangeAmount: number | null,
    discountAmount: number | null,
    files: File[] | null,
    customerPaymentType: PaymentType | null,
    insurancePaymentType: PaymentType | null,
    customerSideInstallment?: IPolicyInstallment | null
    insuranceSideInstallment?: IPolicyInstallment | null
}

export interface AddendumResponse {
    id: number
    policyId: number | null
    addendumType: AddendumType | null,
    addendumTypeTitle: string | null,
    issuedDate: string | null,
    addendumNo: string | null
    shortDescription: string | null,
    fullDescription: string | null,
    premiumChangeAmount: number | null,
    discountAmount: number | null,
    totalPremiumChangeAmount: number | null
    attachments: IAttachmentResponse[],
    customerDepositStatus: DepositStatus,
    customerDepositStatusTitle: string,
    customerPaymentType: PaymentType | null,
    insurancePaymentType: PaymentType | null,
    customerPaymentTypeTitle: string | null,
    customerName: string | null
}

{/**روش پرداخت برای بیمه های عمر */ }
export enum PaymentFrequencyType {

    Yearly = 1,     // سالانه (۱ قسط)
    Monthly = 2,    // ماهانه (۱۲ قسط)
    BiMonthly = 3,  // دوماهه (۶ قسط)
    Quarterly = 4,  // سه‌ماهه (۴ قسط)
    FourMonthly = 5,// چهارماهه (۳ قسط)
    SemiAnnually = 6// شش‌ماهه (۲ قسط)
}
