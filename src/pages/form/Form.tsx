import { Add } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid';
import { useFormStore } from '../../stores/formStore';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IFormPolicyResponse } from '../../types/Form';
import { Delete, TextFields, RemoveRedEye } from '@mui/icons-material';
import FormBuilder from './builder/FormBuilder';
import FormFieldDialog from './components/FormFieldDialog';
import { deleteForm } from '../../server/services/formService';
import toast from 'react-hot-toast';

export default function Form() {

    const [form, setForm] = useState<IFormPolicyResponse>();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openFieldDialog, setOpenFieldDialog] = React.useState(false);

    const { getList, status, dataList } = useFormStore();

    const navigate = useNavigate();
    useEffect(() => {
        if (status === 'idle')
            getList();
    }, [])

    const handleClose = () => {
        setOpenDialog(false);
    }

    const handleViewForm = (form: IFormPolicyResponse) => {
        setOpenDialog(true);
        setForm(form);
    }

    const handleEditField = (form: IFormPolicyResponse) => {
        setOpenFieldDialog(true);
        setForm(form);
    }

    const handleDelete = async (form: IFormPolicyResponse) => {
        try {
            if (window.confirm('از ویرایش اطلاعات مطمئن هستید؟') === true) {
                await deleteForm(form.id).then(() => {
                    toast.success('فرم با موفقیت حذف شد');
                    getList();
                });
            }
        } catch { }
    }

    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'نام فرم',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'description',
            headerName: 'توضیحات',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'category',
            headerName: 'دسته بندی',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'action',
            type: 'actions',
            flex: 1.5,
            getActions: (params: GridRowParams<IFormPolicyResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><Delete color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => handleDelete(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="مدیریت فیلدها"><TextFields color='primary' /></Tooltip>}
                    label="مدیریت فیلدها"
                    onClick={() => handleEditField(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="نمایش فرم"><RemoveRedEye color='primary' /></Tooltip>}
                    label="نمایش فرم"
                    onClick={() => handleViewForm(params.row)}
                />,
            ]
        }
    ]

    return (
        <>
            <Button
                size='small'
                color='primary'
                variant='contained'
                sx={{ width: '150px' }}
                endIcon={<Add />}
                onClick={() => navigate('/insurance-policy/form/create')}>ساخت فرم جدید</Button>

            <MyDataGrid
                loading={status === 'loading' && true}
                columns={columns}
                rows={dataList ?? []}
                getRowId={(row) => row.id}
                pagination={false}
                initialPageSize={1000}
            />

            <FormFieldDialog
                open={openFieldDialog}
                onClose={() => setOpenFieldDialog(false)}
                form={form || null}
            />

            <Dialog
                fullWidth
                maxWidth='lg'
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="dialog-person"

            >
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <FormBuilder form={form || null} formState='view' />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} size='small'>بستن</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
