import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Divider, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import MyDatePicker from '../../../../components/common/datePicker/MyDatePicker';
import { IInsurancePolicyResponse, IPolicyInstallmentResponse, PolicyPaymentGroupType } from '../../../../types/Insurance';
import { PolicyPaymentOption } from '../../../../types/Payment';
import { PaymentType } from '../../../../types/Enums';
import { DepositMethodType } from '../../../../types/Wallet';


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    confirm: (confirm: boolean, startDate?: Date | null | string, paymentOption?: PolicyPaymentOption) => void
    row: IInsurancePolicyResponse | null,
    installment: IPolicyInstallmentResponse | null // if is installment
    depositMethodType: DepositMethodType | null,
    installmentItemId?: number | null,
    paymentGroupType?: PolicyPaymentGroupType
}

function PaymentOptionConfirmDialog({ open = false, onClose, confirm, row, depositMethodType, installment, installmentItemId, paymentGroupType }: IProps) {

    const [startDate, setStartDate] = useState<string | null>();

    useEffect(() => {
        if (installmentItemId) {
            const item = installment?.items.find(c => c.id === installmentItemId);
            setStartDate(item?.dueDate);
        }
    }, [installmentItemId])

    const [selectedOption, setSelectedOption] = useState<PolicyPaymentOption>(PolicyPaymentOption.None);

    useEffect(() => {
        if (open) {
            depositMethodType === DepositMethodType.Wallet ? setSelectedOption(PolicyPaymentOption.Debt)
                :
                row?.paymentTypeId === PaymentType.Installment
                    ? setSelectedOption(PolicyPaymentOption.NewInstallment)
                    : setSelectedOption(PolicyPaymentOption.Discount)
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <FormControlLabel
                                            value={PolicyPaymentOption.NewInstallment}
                                            control={<Radio />}
                                            label="ایجاد قسط جدید"
                                        />
                                        <Stack>
                                            <MyDatePicker
                                                value={startDate}
                                                onChange={setStartDate}
                                                disabled={selectedOption !== PolicyPaymentOption.NewInstallment}
                                            />
                                        </Stack>
                                    </Box>
                                }

                                {/* گزینه تخفیف */}
                                {depositMethodType !== DepositMethodType.Wallet &&
                                    <FormControlLabel
                                        value={PolicyPaymentOption.Discount}
                                        control={<Radio />}
                                        label="اعمال تخفیف برای مشتری"
                                    />
                                }

                                {/* گزینه بدهکاری */}
                              
                                    <FormControlLabel
                                        value={PolicyPaymentOption.Debt}
                                        control={<Radio />}
                                        label={'ثبت بدهکاری مشتری'}
                                    />
                                
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