import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Grid2,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ICompanyAgencyResponse, ICompanyRequest, ICompanyResponse } from '../../types/Company';
import { createCompany, updateCompany } from '../../server/services/companyService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Delete } from '@mui/icons-material';
import { useCompanyStore } from '../../stores/companyStore';


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    data?: ICompanyResponse | null
}


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const defaultValues: ICompanyRequest = {
    id: null,
    isActive: true,
    logo: null,
    name: null,
    code: '',
    description: ''
}

export default function CreateOrUpdateCompanyDialog(props: IProps) {

    const { open, onClose, data } = props;
    const [loading, setLoading] = useState(false);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [fileSizeError, setFileSizeError] = useState(false);
    const { getList } = useCompanyStore();


    const { control, handleSubmit, reset, setValue } = useForm<ICompanyRequest>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (open) {
            setCurrentFile(null);
            if (data) {
                reset(data)
            } else {
                reset(defaultValues)
            }
        }
        else {

        }
    }, [open])

    const handleClose = () => {
        onClose(false);
        reset(defaultValues);
    };

    const onSubmit = (req: ICompanyRequest) => {

        const form = new FormData();
        form.append('name', req.name?.toString() ?? "");
        form.append('isActive', req.isActive === true ? "true" : "false");
        form.append('code', req.code ?? '');
        form.append('description', req.description ?? '');

        if (data) {
            if (currentFile)
                form.append('logo', currentFile);
            form.append('id', data.id?.toString() ?? '')
            update(form);
            handleClose();
        }
        else {
            if (!currentFile) {
                toast.error('لوگو انتخاب نشده است');
                return;
            }
            form.append('logo', currentFile);
            insert(form);
            handleClose();
        }

    }

    const insert = async (form: FormData) => {
        try {
            setLoading(true);
            await createCompany(form).then(() => {
                reset(defaultValues)
                toast.success('اطلاعات با موفقیت ثبت شد');
                getList();
                setLoading(false);
                setCurrentFile(null);
            });
        } catch {
            setLoading(false);
        }
    }

    const update = async (form: FormData) => {
        try {
            setLoading(true);
            await updateCompany(form).then(() => {
                toast.success('اطلاعات با موفقیت ثبت شد');
                getList();
                setLoading(false);
            });
        } catch {
            setLoading(false);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile) {
            if (selectedFile.size > 1048576) {
                setFileSizeError(true);
                setCurrentFile(null);
                setValue('logo', null);
                return;
            }

            setFileSizeError(false);
            setCurrentFile(selectedFile);
            setValue('logo', selectedFile);
        } else {
            setFileSizeError(false);
            setCurrentFile(null);
            setValue('logo', null);
        }
    }

    const PreviewFile = () => {
        return (
            <>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={2} border={'1px grey dashed'} padding={1} borderRadius={2}>
                    <Typography>{currentFile?.name}</Typography>
                    <Typography fontSize={12}>
                        ({((currentFile?.size ?? 0) / 1024).toFixed(2)} KB)
                    </Typography>
                    <Tooltip title='حذف' sx={{ cursor: 'pointer' }}>
                        <Delete fontSize='small'
                            color='error'
                            onClick={() => {
                                setCurrentFile(null);
                                setValue('logo', null);
                                setFileSizeError(false);
                            }}
                        />
                    </Tooltip>
                </Stack>
            </>
        )
    }

    return (
        <>

            <Dialog
                maxWidth='sm'
                open={open}
                keepMounted
                fullWidth
                onClose={handleClose}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{!data ? "جدید" : "ویرایش"}</DialogTitle>
                    <DialogContent sx={{ paddingBottom: 2 }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={9}>
                                <FormControl fullWidth>
                                    <FormLabel>لوگو</FormLabel>
                                    {currentFile ? (
                                        <PreviewFile />
                                    ) : (
                                        <>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                fullWidth
                                            >
                                                انتخاب فایل
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept='.jpg,.png,.webp,.jpeg'
                                                />
                                            </Button>
                                            <Typography color='error' fontSize={12}>
                                                {fileSizeError && "حداکثر حجم فایل مجاز 1 مگابایت است"}
                                            </Typography>
                                        </>
                                    )}
                                </FormControl>
                            </Grid2>
                            {data &&
                                <Grid2 size={2}>
                                    <FormControl>
                                        <FormLabel>لوگو فعلی</FormLabel>
                                        <Tooltip title={data.name}>
                                            <img
                                                src={data.logoUrl}
                                                width={50}
                                                style={{ padding: '0px' }}
                                                alt='no-image'
                                            />
                                        </Tooltip>
                                    </FormControl>
                                </Grid2>
                            }
                            <Grid2 size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>نام شرکت بیمه</FormLabel>
                                    <Controller
                                        control={control}
                                        name='name'
                                        rules={{
                                            required: 'فیلد اجباری'
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                            <TextField
                                                variant='outlined'
                                                onBlur={onBlur}
                                                value={value || ''}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>کد شرکت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='code'
                                        rules={{
                                            required: 'فیلد اجباری'
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                            <TextField
                                                variant='outlined'
                                                onBlur={onBlur}
                                                value={value || ''}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                                dir='ltr'
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={12}>
                                <FormControl fullWidth>
                                    <FormLabel>توضیحات</FormLabel>
                                    <Controller
                                        control={control}
                                        name='description'
                                        render={({ field: { value, onChange, onBlur } }) =>
                                            <TextField
                                                variant='outlined'
                                                onBlur={onBlur}
                                                value={value || ''}
                                                onChange={onChange}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={2}>
                                <FormControl fullWidth>
                                    <FormLabel>وضعیت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='isActive'
                                        render={({ field: { value, onChange, onBlur } }) =>
                                            <Checkbox
                                                checked={!!value}
                                                onChange={(e) => onChange(e.target.checked)}
                                                onBlur={onBlur}
                                            />

                                        }
                                    />
                                </FormControl>
                            </Grid2>
                        </Grid2>
                    </DialogContent>
                    <DialogActions>
                        <Button type='submit' color='success' variant='contained' size='small' loading={loading}>
                            {loading ? 'در حال ثبت...' : 'ثبت'}
                        </Button>
                        <Button size='small' onClick={handleClose} disabled={loading}>
                            بستن
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
