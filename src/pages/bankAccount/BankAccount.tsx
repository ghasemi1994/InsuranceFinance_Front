import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid'
import ActivationStatus from '../../components/common/ActivationStatus'
import { Button, Tooltip } from '@mui/material'
import { Add } from '@mui/icons-material'
import CreateOrUpdateDialog from './CreateOrUpdateDialog'
import { IBankAccount } from '../../types/BankAccount'
import EditIcon from '@mui/icons-material/Edit';
import { useBankStore } from '../../stores/bankStore'


export default function BankAccount() {

    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<IBankAccount | null>(null);
    const { account: { dataList, status }, getAccountList } = useBankStore();

    const columns: GridColDef[] = [
        {
            field: 'bankName',
            headerName: 'بانک',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'branchName',
            headerName: 'شعبه',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'ownerAccountName',
            headerName: 'صاحب حساب',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'accountNumber',
            headerName: 'شماره حساب',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'shebaNumber',
            headerName: 'شماره شبا',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'cardNumber',
            headerName: 'شماره کارت',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'isActive',
            headerName: 'وضعیت',
            flex: 1.5,
            renderCell: (params) => <ActivationStatus status={params.row.isActive} />
        },
        {
            field: 'action',
            type: 'actions',
            getActions: (params: GridRowParams<IBankAccount>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش"><EditIcon color='primary' /></Tooltip>}
                    label="ویرایش"
                    onClick={() => handleEdit(params.row)}
                />,
            ]
        }
    ]

    const handleEdit = (row: IBankAccount) => {
        setSelectedData(row);
        setOpen(true);
    }


    const handleOpen = () => {
        setSelectedData(null);
        setOpen(true);
    }

    useEffect(() => {
        if (status === "idle")
            getAccountList();
    }, [])

    return (
        <>

            <Button
                color='primary'
                variant='contained'
                sx={{ width: '100px' }}
                endIcon={<Add />}
                onClick={handleOpen}>اضافه</Button>


            <CreateOrUpdateDialog
                onClose={() => setOpen(false)}
                open={open}
                data={selectedData}
            />

            <MyDataGrid
                loading={status === 'loading' && true}
                columns={columns}
                rows={dataList ?? []}
                getRowId={(row) => row.id}
                pagination={false}
                initialPageSize={1000}
            />
        </>
    )
}
