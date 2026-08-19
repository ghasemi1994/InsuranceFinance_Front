import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Grid2,
    TextField
} from '@mui/material';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { ICategoryResponse, IUpdateCategoryFeeRquest } from '../../types/Category';
import { updateFee } from '../../server/services/categoryService';
import { useCategoryStore } from '../../stores/categoryStore';


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    item: ICategoryResponse | null
}
export default function EditDialog(props: IProps) {

    const { control, handleSubmit, setValue, reset } = useForm<IUpdateCategoryFeeRquest>();
    const { open, onClose, item } = props;
    const [openDialog, setOpenDialog] = React.useState(open);
    const [loading, setLoading] = React.useState(false);
    const { getList } = useCategoryStore();

    useEffect(() => {
        if (open) {
            setOpenDialog(true);
            if (item) {
                setValue('id', item?.id);
                setValue('feePercentage', item.feePercentage);
            }
        }
    }, [open])

    const handleClose = () => {
        onClose(false);
        setOpenDialog(false);
    };

    const onSubmit = async (data: IUpdateCategoryFeeRquest) => {
        try {
            setLoading(true);
            await updateFee(data).then(() => {
                setLoading(false);
                reset();
                handleClose();
                getList();

            });
        } catch {
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog
                maxWidth='sm'
                open={openDialog}
                keepMounted
                onClose={onClose}
                aria-describedby="dialog-person"
                fullWidth
            >
                <DialogTitle>{"ویرایش"}</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Grid2 container spacing={2}>
        
                            <Grid2 size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>درصد کارمزد معرف</FormLabel>
                                    <Controller
                                        control={control}
                                        name='feePercentage'
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                variant='outlined'
                                                type='number'
                                                dir='ltr'
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                        </Grid2>
                    </DialogContent>
                    <DialogActions>
                        <Button type='submit' color='success' variant='contained' loading={loading}>ثبت</Button>
                        <Button onClick={handleClose}>بستن</Button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    )
}
