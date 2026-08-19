import { createBrand } from '@/server/services/vehicleService';
import { Button, Dialog, DialogActions, DialogContent, FormControl, FormLabel, Grid2, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface BrandDialogProps {
    open: boolean
    onClose: (open: boolean) => void,
    vehicleTypeId: number
}


export default function BrandDialog(props: BrandDialogProps) {

    const [open, setOpen] = useState<boolean>(false);
    const [brandText, setBrandText] = useState("");
    const [loading, setLaoding] = useState<boolean>(false);

    useEffect(() => {
        if (props.open)
            setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
        props.onClose(false);
        setOpen(false);
    };

    const handleSaveClick = async () => {
        if (!brandText) {
            toast.error('brand is required');
            return;
        }

        try {
            setLaoding(true);
            await createBrand({
                title: brandText,
                typeId: props.vehicleTypeId
            }).then(() => {
                toast.success('inserted');
                handleClose();
                setLaoding(false);
                setBrandText('');
            });

        } catch {
            setLaoding(false);
        }

    }

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth='sm'
                keepMounted
                onClose={props.onClose}
            >
                <DialogContent>
                    <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>برند</FormLabel>
                            <TextField
                                onChange={(e) => setBrandText(e.target.value)}
                                value={brandText}
                            />
                        </FormControl>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button
                        color='success'
                        variant='contained'
                        loading={loading}
                        onClick={handleSaveClick}>ثبت برند</Button>
                    <Button onClick={handleClose}>بستن</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}
