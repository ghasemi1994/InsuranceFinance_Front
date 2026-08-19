import { AddCard, InfoOutlined, Receipt } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import {
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
} from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { IFinanceItem, InstallmentSideType } from '../../../../types/Insurance';
import { useInstallmentStore } from '../../../../stores/installmentStore';
import { digitSeprator, numberToPersianWords } from '../../../../utils/text';
import SinglePolicyPaymentDialog from '../../../insruancePolicy/components/payment/SinglePolicyPaymentDialog';
import MyDataGrid from '../../../../components/common/dataGrid/MyDataGrid';
import Filter from './Filter';
import DepositInformationDialog from './DepositInformationDialog';
import usePayment from './usePayment';
import toast from 'react-hot-toast';

export default function ReceiptTab() {


    const [currentRow, setCurrentRow] = useState<IFinanceItem | null>(null);
    const [openDepositDialog, setOpenDepositDialog] = useState(false);

    const { getFinanceItemList, financeItems } = useInstallmentStore();

    const {
        openPaymentDialog,
        setAddendum,
        setDebt,
        setOpenDialog,
        policy,
        openDialog,
        installmentItemId,
        addendum,
        debt,
        groupType
    } = usePayment();

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        getFinanceItemList();
    }


    const columns: GridColDef[] = [
        {
            width: 180,
            field: "customerName",
            headerName: "بیمه گذار",
            renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
                <Tooltip title={params.value || ""}>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        {
            width: 180,
            field: "category",
            headerName: "بیمه",
            renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
                <Tooltip title={params.value || ""}>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        {
            width: 70,
            field: "companyName",
            headerName: "بیمه گر",

        },
        {
            width: 150,
            field: "insuranceNo",
            headerName: "شماره بیمه نامه",
            renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
                <Tooltip title={params.value || ""}>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        {
            width: 150,
            field: "marketer",
            headerName: "بازاریاب",
            renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
                <Tooltip title={params.value || ""}>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        {
            width: 150,
            field: "dueTitle",
            headerName: "نوع سررسيد"
        },
        {
            width: 100,
            field: "dueDate",
            headerName: "تاريخ سررسيد"
        },
        {
            width: 120,
            field: "amountPayable",
            headerName: "قابل پرداخت",
            renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
                <Tooltip title={numberToPersianWords(params.value, 'Rial')}>
                    <span>
                        {digitSeprator(params.value)}
                    </span>
                </Tooltip >
            ),
        },
        {
            width: 120,
            field: "actions",
            headerName: "عملیات",
            type: "actions",
            getActions: (params) => [
                <GridActionsCellItem
                    icon={
                        <Tooltip title="اطلاعات بیشتر">
                            <InfoOutlined color="secondary" />
                        </Tooltip>
                    }
                    label="پرداخت مشتری"
                    onClick={() => console.log(1)}
                />,
                <GridActionsCellItem
                    icon={
                        <Tooltip title="پرداخت">
                            <AddCard color={!params.row.isPaid ? 'primary' : 'disabled'} />
                        </Tooltip>
                    }
                    label="پرداخت مشتری"
                    onClick={() => handlePaymentClick(params.row)}
                    disabled={params.row.isPaid}
                />,
                <GridActionsCellItem
                    icon={
                        <Tooltip
                            title={params.row.isPaid ? "نمایش واریزی" : "پرداخت نشده"}
                        >
                            <Receipt color="action" />
                        </Tooltip>
                    }
                    label="واریزی"
                    onClick={() => handleDepositInformation(params.row)}
                />,

            ],
        },
    ];

    const handlePaymentClick = (item: IFinanceItem) => {
        if (item.isPaid) {
            toast.error("بیمه نامه قبلا پرداخت شده است");
            return;
        }
        openPaymentDialog({
            installmentItemId: item.installmentItemId,
            insurancePolicyId: item.insurancePolicyId,
            policyPaymentGroupType: item.policyPaymentGroupType,
            addendumId: item.addendumId,
            policyPaymentPendingDebtId: item.policyPaymentPendingDebtId,
        })
    }

    const handleDepositInformation = (row: IFinanceItem) => {
        setCurrentRow(row);
        setOpenDepositDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
        setCurrentRow(null);
        setAddendum(null);
        setDebt(null);
        getData();
    }

    const depositHandleClose = () => {
        setOpenDepositDialog(false);
    }

    return (
        <>
            <DepositInformationDialog
                onClose={depositHandleClose}
                open={openDepositDialog}
                row={currentRow}
                sideType={InstallmentSideType.Customer}
            />

            {policy &&
                <SinglePolicyPaymentDialog
                    open={openDialog}
                    onClose={handleClose}
                    row={policy}
                    defaultInstallmentItemId={installmentItemId ?? null}
                    showInstallmentList={false}
                    sideType={InstallmentSideType.Customer}
                    addendum={addendum}
                    debt={debt}
                    paymentGroupType={groupType}
                />
            }

            <Filter
                sideType={InstallmentSideType.Customer}
            />

            <Box sx={{ flex: 1, width: "100%", overflowX: "auto" }} mt={2}>
                <MyDataGrid
                    initialPageSize={5}
                    columns={columns}
                    rows={financeItems.dataList ?? []}
                    getRowId={(row) => (row.customId)}
                    rowHeight={65}
                    loading={financeItems.status === 'loading' ? true : false}
                    sx={{
                        '& .MuiDataGrid-row.expired-row': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            }
                        },
                        '& .MuiDataGrid-row.paid-row': {
                            backgroundColor: 'rgba(0, 255, 0, 0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                            }
                        },
                        '& .MuiDataGrid-virtualScroller': { overflowX: 'auto' },
                    }}
                    getRowClassName={(params) =>
                        params.row.isDueExpired ? 'expired-row' : params.row.isPaid ? 'paid-row' : ''
                    }
                    getCellClassName={(params) => params.row.dueTitle ? 'due-title' : ''}

                />
            </Box>

        </>

    )
}
