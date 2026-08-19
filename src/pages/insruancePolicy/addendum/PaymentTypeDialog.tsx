import { PaymentType } from '@/types/Enums';
import { AddendumRequest, InstallmentSideType, PrePaymentType } from '@/types/Insurance';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import AddendumInstallment from './AddendumInstallment';


interface PaymentTypeDialogProps {
    open: boolean,
    onClose: (open: boolean) => void,
    setValue: any,
    watch: any,
    control: any
}


export default function PaymentTypeDialog({ onClose, open, watch, setValue, control }: PaymentTypeDialogProps) {

    const handleTransferCustomerPayment = () => {
        setValue('insurancePaymentType', watch('customerPaymentType'));
        setValue('insuranceSideInstallment.prePaymentType', watch('customerSideInstallment.prePaymentType'));
        setValue('insuranceSideInstallment.prePaymentValue', watch('customerSideInstallment.prePaymentValue'));
        setValue('insuranceSideInstallment.prePaymentStartDate', watch('customerSideInstallment.prePaymentStartDate'));
        setValue('insuranceSideInstallment.installmentCount', watch('customerSideInstallment.installmentCount'));
        setValue('insuranceSideInstallment.intervalBetweenInstalment', watch('customerSideInstallment.intervalBetweenInstalment'));
        setValue('insuranceSideInstallment.installmentStartDate', watch('customerSideInstallment.installmentStartDate'));
        setValue('insuranceSideInstallment.installmentAmount', watch('customerSideInstallment.installmentAmount'));
    }


    return (
        <>

            <Dialog
                maxWidth='lg'
                fullWidth
                open={open}
                keepMounted
                onClose={() => onClose(false)}
            >
                <DialogTitle component={Divider} color='textDisabled' mb={2}>
                    نوع پرداخت الحاقیه
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={1}>
                        <Grid2 size={5}>
                            <AddendumInstallment
                                title=' پرداخت بیمه گذار (اقساطی / نقد)'
                                installmentSideType={InstallmentSideType.Customer}
                                control={control}
                                setValue={setValue}
                                watch={watch}
                            />
                        </Grid2>
                        <Grid2
                            size={2}
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'start'}
                        >
                            <Button
                                variant='outlined'
                                color='inherit'
                                endIcon={<ArrowLeftIcon />}
                                onClick={handleTransferCustomerPayment}
                            >انتقال اطلاعات</Button>
                        </Grid2>
                        <Grid2 size={5}>
                            <AddendumInstallment
                                title='تسویه با بیمه (اقساطی / نقد)'
                                installmentSideType={InstallmentSideType.Insurance}
                                control={control}
                                setValue={setValue}
                                watch={watch}
                            />
                        </Grid2>
                    </Grid2>

                </DialogContent>
                <DialogActions>
                    <Button
                        color='success'
                        variant='contained'
                        type='button'
                        onClick={() => onClose(false)}
                    >ثبت</Button>
                </DialogActions>
            </Dialog >

        </>
    )
}
