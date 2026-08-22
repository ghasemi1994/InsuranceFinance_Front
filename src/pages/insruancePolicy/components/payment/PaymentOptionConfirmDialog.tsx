import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Divider, FormControl, FormControlLabel, FormHelperText, Grid, Grid2, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import MyDatePicker from '../../../../components/common/datePicker/MyDatePicker';
import { IInsurancePolicyResponse, IPolicyInstallmentResponse, PolicyPaymentGroupType } from '../../../../types/Insurance';
import { PolicyPaymentOption } from '../../../../types/Payment';
import { PaymentType } from '../../../../types/Enums';
import { DepositMethodType, DepositRequest } from '../../../../types/Wallet';
import { digitSeprator } from '@/utils/text';


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    confirm: (confirm: boolean, startDate?: Date | null | string, paymentOption?: PolicyPaymentOption) => void
    row: IInsurancePolicyResponse | null,
    installment: IPolicyInstallmentResponse | null // if is installment
    depositMethodType: DepositMethodType | null,
    installmentItemId?: number | null,
    paymentGroupType?: PolicyPaymentGroupType,
    depositRequest?: DepositRequest
}

function PaymentOptionConfirmDialog({
    open = false,
    onClose,
    confirm,
    row,
    depositMethodType,
    installment,
    installmentItemId,
    paymentGroupType,
    depositRequest
}: IProps) {

    const [startDate, setStartDate] = useState<string | null>();
    const [selectedOption, setSelectedOption] = useState<PolicyPaymentOption>(PolicyPaymentOption.None);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        if (installmentItemId) {
            const item = installment?.items.find(c => c.id === installmentItemId);
            setStartDate(item?.dueDate);

        }
    }, [installmentItemId])


    useEffect(() => {
        if (open) {
            depositMethodType === DepositMethodType.Wallet ? setSelectedOption(PolicyPaymentOption.Debt)
                :
                row?.paymentTypeId === PaymentType.Installment
                    ? setSelectedOption(PolicyPaymentOption.NewInstallment)
                    : setSelectedOption(PolicyPaymentOption.Discount)

            if (paymentGroupType === PolicyPaymentGroupType.CashGroup) {
                setDiscountAmount((row?.totalAmount ?? 0) - (depositRequest?.amount ?? 0));
            } else if (paymentGroupType === PolicyPaymentGroupType.InstallmentGroup) {
                const item = installment?.items.find(c => c.id === installmentItemId);
                setDiscountAmount((item?.dueAmount ?? 0) - (depositRequest?.amount ?? 0));
            }
        }
    }, [open])


    const handleClose = () => {
        onClose(false);
        confirm(false, null, PolicyPaymentOption.None);
    };

    const handleConfirm = () => {
        confirm(true, startDate, selectedOption);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >

                <DialogContent>
                    <Typography fontSize={14} fontWeight={500} color='error' sx={{ marginBottom: 4 }} component={Divider}>
                        کاربر گرامی، مبلغ واریزی کمتر از مبلغ سررسید است. لطفاً یکی از موارد زیر را انتخاب کنید
                    </Typography>

                    <Stack spacing={4}>
                        <FormControl>
                            <RadioGroup
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(Number(e.target.value))}
                            >
                                {/* گزینه قسط جدید با تاریخ */}
                                {row?.paymentTypeId === PaymentType.Installment &&
                                    <Grid2 container spacing={2} alignItems={'center'}>
                                        <Grid2 size={{ xl: 3, lg: 4, md: 4, sm: 6, xs: 12 }}>
                                            <FormControlLabel
                                                value={PolicyPaymentOption.NewInstallment}
                                                control={<Radio />}
                                                label="ایجاد قسط جدید"
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xl: 3, lg: 4, md: 4, sm: 6, xs: 12 }}>
                                            <MyDatePicker
                                                value={startDate}
                                                onChange={setStartDate}
                                                disabled={selectedOption !== PolicyPaymentOption.NewInstallment}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xl: 3, lg: 4, md: 4, sm: 6, xs: 12 }}>
                                            <Typography
                                                color='primary'
                                            >
                                                مبلغ قسط: {' '}
                                                {
                                                    digitSeprator(discountAmount)
                                                }
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                }

                                {/* گزینه تخفیف */}
                                {depositMethodType !== DepositMethodType.Wallet &&
                                    <>
                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                            <FormControlLabel
                                                value={PolicyPaymentOption.Discount}
                                                control={<Radio />}
                                                label="اعمال تخفیف برای مشتری"
                                            />
                                            <Typography
                                                color='error'
                                            >
                                                مبلغ تخفیف: {' '}
                                                {
                                                    digitSeprator(discountAmount)
                                                }
                                            </Typography>
                                        </Stack>
                                    </>
                                }

                                {/* گزینه بدهکاری */}
                                {paymentGroupType !== PolicyPaymentGroupType.DebtGroup &&
                                    <FormControlLabel
                                        value={PolicyPaymentOption.Debt}
                                        control={<Radio />}
                                        label={'ثبت بدهکاری مشتری'}
                                    />
                                }

                                {row?.paymentTypeId === PaymentType.Installment &&
                                    <FormHelperText>اگر کیف پول موجودی داشته باشد از موجودی کم می شود و مابقی بعنوان بدهی در کیف پول ثبت می شود.</FormHelperText>
                                }

                            </RadioGroup>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>انصراف</Button>
                    <Button variant='contained' color='success' onClick={handleConfirm} autoFocus>
                        تایید
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default PaymentOptionConfirmDialog;