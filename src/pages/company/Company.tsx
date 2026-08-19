import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid'
import { Edit, Person2 } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';
import CompanyAgencyDialog from './CompanyAgencyDialog';
import { useCompanyStore } from '../../stores/companyStore';
import ActivationStatus from '../../components/common/ActivationStatus';
import CreateOrUpdateCompanyDialog from './CreateOrUpdateCompanyDialog';
import { ICompanyResponse } from '../../types/Company';

export default function Company() {

    const { getList, status, dataList } = useCompanyStore();
    const [open, setOpen] = useState(false);
    const [openCrud, setOpenCrud] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<ICompanyResponse | null>(null);

    const handleOpen = () => {
        setOpen(true);
    }

    useEffect(() => {
        if (status === 'idle')
            getList();
    }, [])

    const columns: GridColDef[] = [
        {
            field: 'logoUrl',
            headerName: 'لوگو',
            flex: 1.5,
            renderCell: (params) =>
                <Tooltip title={params.row.name}>
                    <img
                        src={params.row.logoUrl}
                        width={30}
                        style={{ padding: '0px' }}
                        alt='no-image'
                    />
                </Tooltip>
        },
        {
            field: 'code',
            headerName: 'کد شرکت',
            flex: 1.5,
        },
        {
            field: 'name',
            headerName: 'نام شرکت',
            flex: 1.5,
        },
        {
            field: 'description',
            headerName: 'توضیحات',
            //flex: 1.5,
            width: 550,
            renderCell: (params) =>
                <Tooltip title={params.value}>
                    {params.value}
                </Tooltip>
        },
        {
            field: 'isActive',
            headerName: 'وضعیت',
            flex: 1.5,
            renderCell: (params) => <ActivationStatus status={params.row.isActive} />
        },
        {
            headerName: 'عملیات',
            field: 'action',
            type: 'actions',
            flex: 1.5,
            getActions: (params: GridRowParams<ICompanyResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="نمایندگی ها"><Person2 color='secondary' /></Tooltip>}
                    label="نمایندگی"
                    onClick={() => handleAgencyOpenDialog(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش"><Edit color='primary' /></Tooltip>}
                    label="ویرایش"
                    onClick={() => handleEdit(params.row)}
                />
            ],
        }
    ]

    const handleAgencyOpenDialog = (item: ICompanyResponse) => {
        setCurrentCompany(item);
        handleOpen();
    };

    const handleEdit = (item: ICompanyResponse) => {
        setCurrentCompany(item);
        setOpenCrud(true);
    }

    const handleClick = () => {
        setOpenCrud(true);
    }

    const handleCloseCrud = () => {
        setOpenCrud(false);
        setCurrentCompany(null);
    }


    return (
        <>

            <Button
                onClick={handleClick}
                variant='contained'
                color='primary'
                sx={{ width: 100 }}
            >اضافه کردن</Button>

            <Box>
                <MyDataGrid
                    loading={false}
                    columns={columns}
                    rows={dataList ?? []}
                    getRowId={(row) => row.id}
                    pagination={false}
                    initialPageSize={1000}
                />
            </Box>

            <CreateOrUpdateCompanyDialog
                open={openCrud}
                onClose={handleCloseCrud}
                data={currentCompany}
            />

            <CompanyAgencyDialog
                onClose={() => setOpen(false)}
                open={open}
                company={currentCompany}
            />


        </>
    )
}
