import { IFinanceItemFilter, InstallmentSideType } from '../../types/Insurance';
import { GeneralFinanceReportFilter } from '../../types/Report';
import http from '../http';

const getOverview = async () => {
    const { data } = await http.get('/finance/api/report/get-overview');
    return data
}

const getGeneralFinanceReport = async (filter: GeneralFinanceReportFilter) => {
    const params = new URLSearchParams();

    if (filter.startDate) params.append("startDate", filter.startDate);
    if (filter.endDate) params.append("endDate", filter.endDate);
    if (filter.personMarketerId) params.append('personMarketerId', filter.personMarketerId.toString());
    if (filter.categoryId) params.append('categoryId', filter.categoryId.toString());

    const { data } = await http.get(`/finance/api/report/get-general-report?${params.toString()}`);
    return data;
};


const _getFilterFinanceItem = (filter?: IFinanceItemFilter): string => {
    const params = new URLSearchParams();

    if (filter?.nationalCode) params.append("nationalCode", filter.nationalCode);
    if (filter?.dueType) params.append("dueType", filter.dueType.toString());
    if (filter?.startDate) params.append("startDate", filter.startDate);
    if (filter?.endDate) params.append("endDate", filter.endDate);
    if (filter?.dueStatus) params.append("dueStatus", filter.dueStatus.toString());
    if (filter?.settlementStatus) params.append("settlementStatus", filter.settlementStatus.toString());
    if (filter?.personId) params.append("personId", filter.personId.toString());
    if (filter?.marketerId) params.append("marketerId", filter.marketerId.toString());
    if (filter?.startPaymentDate) params.append('startPaymentDate', filter.startPaymentDate?.toString())
    if (filter?.endPaymentDate) params.append('endPaymentDate', filter.endPaymentDate?.toString())

    params.append(
        "sideType",
        (filter?.sideType ?? InstallmentSideType.Customer).toString()
    );

    return params.toString();
}

const getFinanceItemList = async (filter?: IFinanceItemFilter) => {
    const { data } = await http.get(`/finance/api/report/get-finance-item-list?${_getFilterFinanceItem(filter)}`);
    return data;
};

const getFinanceItemExcelByte = async (filter?: IFinanceItemFilter) => {
    const { data } = await http.get(`/finance/api/report/export-finance-item-list-excel?${_getFilterFinanceItem(filter)}`);
    return data;
};





export {
    getOverview,
    getGeneralFinanceReport,
    getFinanceItemList,
    getFinanceItemExcelByte
}