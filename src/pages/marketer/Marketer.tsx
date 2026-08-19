import React, { useEffect, useState } from 'react'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { Button, Switch, Tooltip } from '@mui/material'
import { IMarketerResponse } from '../../types/Person'
import DeleteIcon from '@mui/icons-material/Delete';
import { useMarketerStore } from '../../stores/marketerStore'
import { Add, Upload } from '@mui/icons-material'
import CreateDialog from './CreateDialog'
import { deleteMarketr, toggleActivation } from '../../server/services/personService'
import toast from 'react-hot-toast'
import MarketerDocumentUploader from './MarketerDocumentUploader'
import ActivationStatus from '../../components/common/ActivationStatus'


export default function Marketer() {

    const { dataList, getList, status } = useMarketerStore();
    const [open, setOpen] = useState(false);
    const [uploaderOpen, setUploaderOpen] = useState(false);
    const [currentRecord, setCurrentRecod] = useState<IMarketerResponse>();

    useEffect(() => {
        if (status === 'idle')
            getList();
    }, []);

    const changeActivation = async (item: IMarketerResponse) => {
        try {
            await toggleActivation(item.id);
            getList();
        } catch (error) {
            console.error(error);
        }
    };
    const columns: GridColDef<IMarketerResponse>[] = [
        {
            field: 'fullName',
            headerName: 'نام بازاریاب',
            flex: 1.5,
        },
        {
            field: 'marketerCode',
            headerName: 'کد بازاریابی',
            flex: 1.5,
        },
        {
            field: 'nationalCode',
            headerName: 'کد ملی',
            flex: 1.5,
        },
        {
            field: 'phoneNumber',
            headerName: 'شماره تلفن',
            flex: 1.5,
        },
        {
            field: 'isActive',
            headerName: 'وضعیت',
            flex: 1.5,
            renderCell: (params) => (
                <Switch
                    checked={params.row.isActive}
                    color="primary"
                    onChange={(e) => changeActivation(params.row)}
                />
            ),
        },
        {
            field: 'action',
            type: 'actions',
            getActions: (params: GridRowParams<IMarketerResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="آپلود مدارک"><Upload color='primary' /></Tooltip>}
                    label="آپلود مدارک"
                    onClick={() => handleDocumentDialog(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><DeleteIcon color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => handleDelete(params.row)}
                />,
            ],
        }

    ]

    const handleDelete = async (model: IMarketerResponse) => {
        try {
            if (model?.id) {
                if (window.confirm('از حذف اطلاعات مطمئن هستید؟') === true) {
                    await deleteMarketr(model.id).then(() => {
                        toast.success('اطلاعات با موفقیت از سیستم حذف شد');
                        getList();
                    });
                }
            }

        } catch { }
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleDocumentDialog = (row: IMarketerResponse) => {
        setUploaderOpen(true);
        setCurrentRecod(row);
    }


    return (
        <>
            <MarketerDocumentUploader
                open={uploaderOpen}
                onClose={() => setUploaderOpen(false)}
                record={currentRecord ?? null}
            />

            <Button
                color='primary'
                variant='contained'
                sx={{ width: '100px' }}
                endIcon={<Add />}
                onClick={handleOpen}>اضافه</Button>

            <CreateDialog
                onClose={() => setOpen(false)}
                open={open}
            />

            <MyDataGrid
                filterMode='client'
                loading={status === 'loading' ? true : false}
                columns={columns}
                rows={dataList ?? []}
                getRowId={(row) => row.id}
                rowHeight={60}
                initialPageSize={50}
            />

        </>
    )
}
