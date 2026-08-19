import MyDataGrid from '@/components/common/dataGrid/MyDataGrid'
import React, { useState } from 'react'
import { useBranch } from './useBranch'
import { Button, Grid2, Tooltip } from '@mui/material'
import { Add, Edit, People } from '@mui/icons-material'
import UpsertBranchDialog from './UpsertBranchDialog'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { BranchResponse } from '@/types/OfficeTypes'
import CreateStaffDialog from './CreateStaffDialog'

export default function Branch() {

    const { dataList, initiDataList } = useBranch();
    const [openUpsertDialog, setOpenUpsertDialog] = useState(false);
    const [openStaffDialog, setOpenStaffDialog] = useState(false);
    const [branchSelected, setBranchSelected] = useState<BranchResponse | null>(null);

    const handleClose = () => {
        setOpenUpsertDialog(false);
        initiDataList();
    }

    const handleOpenStaffDialog = (item: BranchResponse) => {
        setOpenStaffDialog(true);
        setBranchSelected(item);

    }

    const columns: GridColDef<BranchResponse>[] = [
        {
            field: 'name',
            headerName: 'نام شعبه',
            width: 200
        },
        {
            field: 'code',
            headerName: 'کد شعبه',
            width: 150
        },
        {
            field: 'managerFullName',
            headerName: 'مدیر شعبه',
            width: 200
        },
        {
            field: 'address',
            headerName: 'آدرس',
            flex: 1.5,
        },
        {
            field: 'action',
            type: 'actions',
            getActions: (params: GridRowParams<BranchResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="کارشناسان فروش"><People color='action' /></Tooltip>}
                    label="کارشناسان فروش"
                    onClick={() => handleOpenStaffDialog(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش"><Edit color='action' /></Tooltip>}
                    label="ویرایش"
                    onClick={() => {
                        setBranchSelected(params.row);
                        setOpenUpsertDialog(true);
                    }}
                />,
            ],
        }
    ]

    return (
        <>
            <CreateStaffDialog
                open={openStaffDialog}
                onClose={setOpenStaffDialog}
                currentBranch={branchSelected}
            />
            <UpsertBranchDialog
                open={openUpsertDialog}
                onClose={handleClose}
                item={branchSelected}
            />
            <Grid2>
                <Button
                    endIcon={<Add />}
                    onClick={() => {
                        setBranchSelected(null);
                        setOpenUpsertDialog(true);
                    }}
                >ایجاد شعبه</Button>
            </Grid2>
            <MyDataGrid
                filterMode='client'
                //loading={status === 'loading' ? true : false}
                columns={columns}
                rows={dataList ?? []}
                getRowId={(row) => row.id}
                rowHeight={60}
                pagination={false}
            />
        </>
    )
}
