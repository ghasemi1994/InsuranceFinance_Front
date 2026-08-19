import { Button, Card, Chip, Divider, FormControl, FormLabel, Grid2, TextField, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { DepositStatus, AddendumResponse, IInsurancePolicyResponse, InstallmentSideType, PolicyPaymentGroupType } from '../../../types/Insurance';
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import MyDataGrid from '../../../components/common/dataGrid/MyDataGrid';
import { digitSeprator, numberToPersianWords } from '../../../utils/text';
import AttachmentListGridColumn from '../../../components/common/AttachmentListGridColumn';
import { AddCard, Delete } from '@mui/icons-material';
import SinglePolicyPaymentDialog from '../components/payment/SinglePolicyPaymentDialog';
import { PaymentType } from '@/types/Enums';
import useAddendum from './useAddendum';
import CreateAddendumtDialog from './CreateAddendumDialog';

export default function Addendum() {

    const {
        handleOpenPaymentDialog,
        deleteAddendumItem,
        handleOpenDialog,
        handlePaymentClose,
        handleGetInsurance,
        handleCloseAddedumCreateDialog,
        setInsuranceNo,
        addendum,
        openPaymnetDialog,
        policy,
        insurance,
        addendumLoding,
        addendumList,
        openCreateAddendumDialog
    } = useAddendum();



    const columns: GridColDef[] = [
        {
            field: 'addendumNo',
            headerName: 'شماره الحاقیه',
            width: 180
        },
        {
            field: 'addendumTypeTitle',
            headerName: 'نوع الحاقیه',
            width: 100
        },
        {
            field: 'issuedDate',
            headerName: 'تاریخ صدور الحاقیه',
            width: 130
        },
        {
            field: 'premiumChangeAmount',
            headerName: 'مبلغ (+/-)',
            width: 150,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <Tooltip title={numberToPersianWords(params.value, 'Toman')}>
                    <div style={{ direction: 'ltr' }}>
                        {digitSeprator(params.value)}
                    </div>
                </Tooltip >
            ),
        },
        {
            field: 'customerPaymenType',
            headerName: 'نوع پرداخت',
            width: 100,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <Chip
                    color={params.row.customerPaymentType === PaymentType.Installment ? 'success' : 'error'}
                    label={params.row.customerPaymentTypeTitle} />
            ),
            filterable: false,
            sortable: false
        },
        {
            field: 'customerDepositStatusTitle',
            headerName: 'وضعیت تسویه',
            width: 100,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <Chip
                    color={params.row.customerDepositStatus === DepositStatus.Complete ? 'success' : params.row.customerDepositStatus === DepositStatus.InProgress ? 'primary' : 'error'}
                    label={params.value} />
            ),
            filterable: false,
            sortable: false
        },
        {
            field: 'shortDescription',
            headerName: 'شرح کوتاه',
            width: 180,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <Tooltip title={params.value}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip >
            ),
            filterable: false,
            sortable: false
        },
        {
            field: 'fullDescription',
            headerName: 'شرح کامل',
            width: 180,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <Tooltip title={params.value}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip >
            ),
            filterable: false,
            sortable: false
        },

        {
            field: 'file',
            headerName: 'فایل (ها)',
            width: 100,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <AttachmentListGridColumn attachments={params?.row?.attachments} />
            ),
            filterable: false,
            sortable: false
        },
        {
            headerName: 'عملیات',
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: (params: GridRowParams<AddendumResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="پرداخت (مشتری)"><AddCard color='primary' /></Tooltip>}
                    label="پرداخت مشتری"
                    onClick={() => handleOpenPaymentDialog(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><Delete color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => deleteAddendumItem(params.row)}
                />

            ],
        },

    ]


    return (
        <>
            {policy &&
                <SinglePolicyPaymentDialog
                    open={openPaymnetDialog}
                    onClose={handlePaymentClose}
                    row={policy}
                    defaultInstallmentItemId={null}
                    showInstallmentList={true}
                    sideType={InstallmentSideType.Customer}
                    addendum={addendum}
                    paymentGroupType={PolicyPaymentGroupType.AddendumGroup}
                />
            }

            <Card>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>شماره بیمه نامه</FormLabel>
                            <TextField
                                size='small'
                                dir='ltr'
                                variant='outlined'
                                onChange={(e) => setInsuranceNo(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2>
                        <Button
                            size='small'
                            loading={addendumLoding}
                            sx={{ mt: 4 }}
                            color='primary'
                            variant='contained'
                            onClick={handleGetInsurance}
                        >جستجو</Button>
                    </Grid2>
                </Grid2>
                <Divider sx={{ my: 2 }}>اطلاعات بیمه گذار</Divider>
                <Grid2 container spacing={2} sx={{ p: 2, borderRadius: 2 }}>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>بیمه گذار</FormLabel>
                            <TextField
                                disabled
                                value={insurance?.customerName || ''}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نوع بیمه نامه</FormLabel>
                            <TextField
                                disabled
                                value={insurance?.categoryTitle || ''}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>شماره بیمه نامه</FormLabel>
                            <TextField
                                disabled
                                value={insurance?.insuranceNo || ''}
                                dir='ltr'
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>شرکت بیمه گر</FormLabel>
                            <TextField
                                disabled
                                value={insurance?.insuranceCompanyName || ''}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نمایندگی</FormLabel>
                            <TextField
                                disabled
                                value={insurance?.insuranceCompanyAgencyName || ''}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ lg: 3, xl: 3, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تاریخ صدور بیمه</FormLabel>
                            <TextField
                                disabled
                                value={insurance?.issueDate || ''}
                                dir='ltr'
                            />
                        </FormControl>
                    </Grid2>
                </Grid2>
            </Card>

            <Grid2 container spacing={2}>
                <Button
                    color='success'
                    variant='contained'
                    onClick={handleOpenDialog}
                >ثبت الحاقیه جدید</Button>
            </Grid2>

            <CreateAddendumtDialog
                open={openCreateAddendumDialog}
                onClose={handleCloseAddedumCreateDialog}
                insurance={insurance}
                addendumList={addendumList}
            />

            <MyDataGrid
                columns={columns}
                rows={addendumList}
                loading={addendumLoding}
                pagination={false}
                getRowId={(d) => d.id}
            />

        </>
    )
}
