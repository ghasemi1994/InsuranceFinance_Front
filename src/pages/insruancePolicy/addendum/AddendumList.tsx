import AttachmentListGridColumn from '@/components/common/AttachmentListGridColumn';
import MyDataGrid from '@/components/common/dataGrid/MyDataGrid';
import PeopleAutoComplete from '@/components/common/dropDown/PeopleAutoComplete';
import { getAddendumList } from '@/server/services/insuranceService';
import { PaymentType } from '@/types/Enums';
import { AddendumResponse, DepositStatus, InstallmentSideType, PolicyPaymentGroupType } from '@/types/Insurance';
import { digitSeprator, numberToPersianWords } from '@/utils/text';
import { AddCard, Delete } from '@mui/icons-material';
import { Button, Card, Chip, FormControl, FormLabel, Grid2, Tooltip } from '@mui/material';
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import SinglePolicyPaymentDialog from '../components/payment/SinglePolicyPaymentDialog';
import useAddendum from './useAddendum';


export default function AddendumList() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AddendumResponse[]>([]);
    const [filter, setFilter] = useState<number | null>(null);

    const {
        handleOpenPaymentDialog,
        deleteAddendumItem,
        handlePaymentClose,
        addendum,
        openPaymnetDialog,
        policy,
    } = useAddendum();


    const getAddendum = async (filter: number | null) => {
        setLoading(true);
        await getAddendumList(filter).then((res) => {
            if (res?.data)
                setData(res?.data);
            else
                setData([]);
        }).finally(() => setLoading(false));

    }

    useEffect(() => {
        getAddendum(null);
    }, [])

    const columns: GridColDef[] = [
        {
            field: 'customerName',
            headerName: 'بیمه گذار',
            width: 200
        },
        {
            field: 'addendumNo',
            headerName: 'شماره الحاقیه',
            width: 170
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
            width: 130,
            renderCell: (params: GridRenderCellParams<AddendumResponse>) => (
                <Tooltip title={numberToPersianWords(params.value, 'Toman')}>
                    <div style={{ direction: 'ltr' }}>
                        {digitSeprator(params.value)}
                    </div>
                </Tooltip>
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

    const handleFilter = () => {
        getAddendum(filter);
    }

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
                <Grid2 container spacing={2} mb={1}>
                    <Grid2 size={{ xl: 4, lg: 4, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>بیمه گذار</FormLabel>
                            <PeopleAutoComplete
                                onChange={(e) => setFilter(e)}
                                value={filter}
                            />
                        </FormControl>
                    </Grid2>
                </Grid2>

                <Button
                    onClick={handleFilter}
                    loading={loading}
                >جستجو</Button>
            </Card>
            
            <MyDataGrid
                columns={columns}
                rows={data}
                loading={loading}
                initialPageSize={10}
                getRowId={(d) => d.id}
            />
        </>
    )
}
