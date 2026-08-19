import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid2, Stack, TextField, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormFieldType, IFormFieldPolicyRequest, IFormFieldPolicyResponse, IFormPolicyResponse } from '../../../types/Form'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import MyDataGrid from '../../../components/common/dataGrid/MyDataGrid'
import { Delete, Edit } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import FormFieldTypeAutoComplete from '../../../components/common/dropDown/FormFieldTypeAutoComplete'
import { createField, deleteFormField, getFieldByFormIdList, updateField } from '../../../server/services/formService'
import toast from 'react-hot-toast'
import { useFormStore } from '../../../stores/formStore'

interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    form: IFormPolicyResponse | null
}

const defaultValues = {
    title: '',
    dataOption: '',
    defaultValue: '',
    description: '',
    displayOrder: 1,
    formFieldTypeId: null,
    id: null,
    isRequired: false
};
export default function FormFieldDialog({ onClose, open, form }: IProps) {

    const { getList } = useFormStore();
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [loading, setLoading] = useState(false);
    const [showLisData, setShowListData] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const { control, handleSubmit, setValue, reset } = useForm<IFormFieldPolicyRequest>({
        defaultValues: defaultValues
    });
    const [fields, setFields] = useState<IFormFieldPolicyResponse[]>([]);

    useEffect(() => {
        if (open)
            getData();
    }, [open])


    const getData = async () => {
        try {
            if (form)
                await getFieldByFormIdList(form?.id).then((response) => {
                    setFields(response?.data);
                });
        } catch { }
    }

    const handleDelete = async (row: IFormFieldPolicyResponse) => {
        if (window.confirm('از حذف اطلاعات مطمئن هستید؟') === true) {
            try {
                if (form) {
                    await deleteFormField(form.id, row.id).then(() => {
                        getData();
                        toast.success('فیلد با موفقیت حذف شد');
                        getList();
                    });
                }
            } catch (error) {
            }
        }
    }

    const handleSetFields = (row: IFormFieldPolicyResponse) => {
        setCanEdit(row.canFieldEdit);
        setFormMode('edit');
        setValue('id', row.id);
        setValue('title', row.title);
        setValue('description', row.description);
        setValue('defaultValue', row.defaultValue);
        setValue('formFieldTypeId', row.formFieldTypeId);
        setValue('displayOrder', row.displayOrder);
        setValue('isRequired', row.isRequired || false);
        if (row.formFieldTypeId === FormFieldType.List) {
            setValue('dataOption', row.dataOption);
            setShowListData(true);
        } else {
            setShowListData(false);
        }
    }

    const handleFormFeildType = (typeId: FormFieldType | null) => {
        if (typeId === FormFieldType.List)
            setShowListData(true);
        else {
            setShowListData(false);
            setValue('dataOption', null);
        }
        if (typeId)
            setValue('formFieldTypeId', typeId);
    }


    const onSubmit = async (data: IFormFieldPolicyRequest) => {
        if (data.formFieldTypeId === FormFieldType.List) {
            if (!data.dataOption) {
                toast.error("مقادیر اولیه فیلد لیست را وارد کنید");
                return;
            }
        }
        if (formMode === 'create')
            addField(data);
        else
            update(data);
    }

    const update = async (data: IFormFieldPolicyRequest) => {
        try {
            if (form) {
                if (!canEdit) {
                    toast.error('بدلیل استفاده شدن فرم در بیمه نامه، ویرایش مجاز نمی باشد');
                    return;
                }
                if (window.confirm('از ویرایش اطلاعات مطمئن هستید؟') === true) {
                    setLoading(true);
                    await updateField(form?.id, data).then(() => {
                        getData();
                        reset(defaultValues);
                        toast.success('فیلد با موفقیت ویرایش شد');
                        setLoading(false);
                        setFormMode('create');
                        getList();
                    });
                }
            }
        } catch { setLoading(false); }
    }

    const addField = async (data: IFormFieldPolicyRequest) => {
        try {
            if (form) {
                setLoading(true);
                await createField(form?.id, data).then(() => {
                    getData();
                    reset(defaultValues);
                    toast.success('فیلد با موفقیت اضافه شد');
                    setLoading(false);
                    getList();
                });
            }
        } catch { setLoading(false); }
    }

    const handleCancelEdit = () => {
        reset(defaultValues);
        setFormMode('create');
        setShowListData(false);
    }


    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'نام فیلد',
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
            field: 'displayOrder',
            headerName: 'ترتیب نمایش',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'formFieldTypeTitle',
            headerName: 'نوع فیلد',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'defaultValue',
            headerName: 'مقدار اولیه',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'dataOption',
            headerName: 'مقادیر لیست',
            flex: 1.5,
            filterable: false
        },
        {
            field: 'isRequired',
            headerName: 'اجباری بودن',
            flex: 1.5,
            filterable: false,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value || false}
                    color="primary"
                />
            )
        },
        {
            field: 'action',
            type: 'actions',
            flex: 1.5,
            getActions: (params: GridRowParams<IFormFieldPolicyResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><Delete color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => handleDelete(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش"><Edit color='primary' /></Tooltip>}
                    label="ویرایش"
                    onClick={() => handleSetFields(params.row)}
                />,
            ]
        }
    ]


    return (
        <>
            <Dialog
                fullWidth
                maxWidth='lg'
                open={open}
                keepMounted
                onClose={onClose}
                aria-describedby="dialog-person"
            >
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Grid2 container spacing={2} marginBottom={2}>
                            <Grid2 size={2}>
                                <FormControl fullWidth>
                                    <FormLabel>نام فیلد</FormLabel>
                                    <Controller
                                        control={control}
                                        name='title'
                                        rules={{ required: 'فیلد اجباری' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
                                                onChange={onChange}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={3}>
                                <FormControl fullWidth>
                                    <FormLabel>توضیحات فیلد</FormLabel>
                                    <Controller
                                        control={control}
                                        name='description'
                                        render={({ field: { onChange, value } }) =>
                                            <TextField
                                                onChange={onChange}
                                                value={value}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={2}>
                                <FormControl fullWidth>
                                    <FormLabel>ترتیب نمایش</FormLabel>
                                    <Controller
                                        control={control}
                                        name='displayOrder'
                                        rules={{ required: 'فیلد اجباری' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <NumericFormat
                                                onChange={onChange}
                                                value={value}
                                                customInput={TextField}
                                                prefix=""
                                                variant="outlined"
                                                dir='ltr'
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={3}>
                                <FormControl fullWidth>
                                    <FormLabel>نوع فیلد</FormLabel>
                                    <Controller
                                        control={control}
                                        name='formFieldTypeId'
                                        rules={{ required: 'فیلد اجباری' }}
                                        render={({ field: { value }, fieldState: { error } }) =>
                                            <FormFieldTypeAutoComplete
                                                onChange={(e) => handleFormFeildType(e)}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={2}>
                                <FormControl fullWidth>
                                    <FormLabel>مقدار اولیه</FormLabel>
                                    <Controller
                                        control={control}
                                        name='defaultValue'
                                        render={({ field: { onChange, value } }) =>
                                            <TextField
                                                onChange={onChange}
                                                value={value}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            {showLisData &&
                                <Grid2 size={12}>
                                    <FormControl fullWidth>
                                        <FormLabel>مقادیر فیلد لیستی</FormLabel>
                                        <Controller
                                            control={control}
                                            name='dataOption'
                                            render={({ field: { onChange, value } }) =>
                                                <TextField
                                                    //disabled={formMode === 'edit'}
                                                    onChange={onChange}
                                                    value={value}
                                                    variant='outlined'
                                                    helperText='مقادیر اولیه `فیلد لیستی` خود را با استفاده از `-` از هم جدا کنید'

                                                />
                                            }
                                        />
                                    </FormControl>
                                </Grid2>
                            }

                            <Grid2 size={3}>
                                <FormControl fullWidth>
                                    <Controller
                                        control={control}
                                        name='isRequired'
                                        render={({ field: { onChange, value } }) =>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => onChange(e.target.checked)}
                                                        checked={value || false}
                                                        value={value}
                                                    />
                                                }
                                                label="فیلد اجباری می باشد؟"
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Stack textAlign={'end'} width={'100%'}>
                                <Grid2 size={2} width={'100%'}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type='submit'
                                        loading={loading}
                                    >
                                        {formMode === 'create' ? 'ثبت فیلد' : 'ویرایش فیلد'}
                                    </Button>
                                    {" "}
                                    {formMode == 'edit' &&
                                        <Button
                                            onClick={handleCancelEdit}
                                            variant="contained"
                                            color="primary"
                                        >
                                            انصراف از ویرایش
                                        </Button>
                                    }
                                </Grid2>
                            </Stack>


                        </Grid2>

                    </form>
                    <MyDataGrid
                        pagination={false}
                        columns={columns}
                        rows={fields ?? []}
                        getRowId={(row) => row.id}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(false)} size='small'>بستن</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
