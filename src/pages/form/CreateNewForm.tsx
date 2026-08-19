
import { Button, FormControl, FormLabel, Stack, TextField } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import React from 'react'
import CategoryAutoComplete from '../../components/common/dropDown/CategoryAutoComplete';
import { useFormStore } from '../../stores/formStore';
import CreateFormField from './components/CreateFormField';
import toast from 'react-hot-toast';

export default function CreateNewForm() {
    const {
        create,
        status,
        setFormData,
        formData,
        formFields,
        addFormField,
        removeFormField,
        resetFormData,
        getList
    } = useFormStore();

    const invalidFields = formFields.some(field =>
        !field.title?.trim() ||
        !field.formFieldTypeId ||
        !field.displayOrder
    );

    const checkFormData = () => {

        if (!formData?.title?.trim()) {
            toast.error('عنوان فرم را وارد کنید');
            return false;
        }
        if (!formData?.assignToCategoryId) {
            toast.error('دسته بندی های خود را انتخاب کنید');
            return false;
        }
        if (invalidFields) {
            toast.error('فیلد های خود را چک کنید');
            return false;
        }
        return true;
    }

    const handleSaveForm = async () => {
        try {
            if (!checkFormData())
                return;
            const formToSave = {
                ...formData,
                fields: [...formFields]
            }
            await create(formToSave).then(() => {
                toast.success('فرم با موفقیت ذخیره شد');
                resetFormData();
                getList();
            });

        } catch { }
    }

    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={3}>
                    <FormControl fullWidth>
                        <FormLabel>نام فرم</FormLabel>
                        <TextField
                            onChange={(e) => setFormData({ title: e.target.value })}
                            value={formData?.title}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={4}>
                    <FormControl fullWidth>
                        <FormLabel>توضیحات</FormLabel>
                        <TextField
                            onChange={(e) => setFormData({ description: e.target.value })}
                            value={formData?.description}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={5}>
                    <FormControl fullWidth>
                        <FormLabel>دسته بندی</FormLabel>
                        <CategoryAutoComplete                            
                            onChange={(e) => setFormData({ assignToCategoryId: e })}
                            value={formData?.assignToCategoryId}
                        />
                    </FormControl>
                </Grid2>
            </Grid2>


            {/* Render multiple form fields */}
            {formFields.map((_, index) => (
                <CreateFormField key={index} fieldIndex={index} />
            ))}

            <Grid2 container>
                <Stack flexDirection={'row'} gap={1} justifyContent={'center'} width={'100%'} marginTop={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addFormField}
                    >
                        افزودن فیلد
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => removeFormField(formFields.length - 1)}
                        disabled={formFields.length <= 0}
                    >
                        حذف فیلد
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSaveForm}
                        disabled={formFields.length <= 0}
                        loading={status === 'loading' ? true : false}
                    >
                        ثبت فرم
                    </Button>
                </Stack>
            </Grid2>

        </>
    )
}
