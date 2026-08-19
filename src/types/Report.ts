import { ReminderCategory } from "./Enums";


export interface FinanceOverviewResponse {
    totalCustomerCount: number;
    totalPersonCount: number;
    totalMarketerCount: number;
    totalPolicyCount: number;
    customerInstallmentItem: FinanceItemChartOverviewResponse
    insuranceInstallmentItem: FinanceItemChartOverviewResponse
}

export interface FinanceItemChartOverviewResponse {
    totalItemCount: number;
    totalItemPaid: number;
    totalItemUnPaid: number;
    totalItemExpired: number;
}

export interface GeneralFinanceReport {
    totalCustomerPaid: number;
    insuranceIssuedCount: number;
    customerTotlalUnpaid: number;
    insuranceTotlalUnpaid: number;
    customerIndebtedness: number;
}

export interface GeneralFinanceReportFilter {
    startDate: string | null
    endDate: string | null
    personMarketerId: number | null
    categoryId: number | null
}



