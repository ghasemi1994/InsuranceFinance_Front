import React, { useState } from 'react'
import PolicyInstallment from '../components/PolicyInstallment'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { NumericFormat } from 'react-number-format'
import { DepositStatus, InstallmentSideType } from '../../../types/Insurance'
import { Controller, useFormContext } from 'react-hook-form'
import { ObligatedToPayType } from '../../../types/Enums'
import FeeForm from './FeeForm'
import { useInsurancePolicyStore } from '@/stores/insurancePolicyStore'
import PaymentFrequencyAutoComplete from '@/components/common/dropDown/PaymentFrequencyAutoComplete'
import { Visibility } from '@mui/icons-material'
import DisplayInstalmentTableDialog from '../components/DisplayInstalmentTableDialog'
import { ArrowLeftIcon } from '@mui/x-date-pickers'


interface IProps {
  openFeeDialog: boolean
  onCloseFeeDialog: (open: boolean) => void,
}
export default function FinanceStep({ openFeeDialog, onCloseFeeDialog }: IProps) {

  const { watch, control, setValue } = useFormContext();
  const { dataForEdit, formData } = useInsurancePolicyStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState(formData.customerFullName);

  const canEditCustomer = (watch("id") && !(dataForEdit?.customerDepositStatus === DepositStatus.Pending));
  const canEditInsurance = (watch("id") && !(dataForEdit?.insuranceDepositStatus === DepositStatus.Pending));

  const isLifeInsurance = (dataForEdit ? dataForEdit.categoryCode : formData.categoryCode) === '210';

  const getCurrentInstallmentData = () => ({
    ...watch('customerSideInstallment'),
    totalAmount: (watch('totalAmount') ?? 0) - (watch('discountAmount') ?? 0),
    paymentFrequencyType: watch('paymentFrequencyType'),
    lifeAdjustmentPercent: watch('lifeAdjustmentPercent'),
    lifeInsuranceYear: watch('lifeInsuranceYear'),
    isLifeInsurance: isLifeInsurance
  });

  const obligatedToPayTypeChange = (e: number) => {
    setValue('obligatedToPayType', e);
    if (e === ObligatedToPayType.Customer)
      setName(formData.customerFullName || 'تعیین نشده');
    else if (e === ObligatedToPayType.Marketer)
      setName(formData.marketerFullName || 'تعیین نشده');
    else if (e === ObligatedToPayType.IntroducerOrGarantor)
      setName(formData.introducerFullName || 'تعیین نشده');
    else
      setName('not-found');
  }

  const handleTransferCustomerPayment = () => {
    setValue('insurancePaymentType', watch('paymentType'));
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

      <Grid2 container spacing={2}
        sx={{
          opacity: (canEditCustomer || canEditInsurance) ? 0.6 : 1,
          pointerEvents: (canEditCustomer || canEditInsurance) ? 'none' : 'auto'
        }}
      >

        <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
          <FormControl fullWidth>
            <FormLabel>مبلغ بيمه نامه (ریال)</FormLabel>
            <Controller
              name='totalAmount'
              control={control}
              render={({ fieldState: { error }, field: { onChange, value } }) => (
                <NumericFormat
                  value={value}
                  onValueChange={(values) => {
                    // Convert the string value to number
                    onChange(values.floatValue);
                  }}
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  prefix=""
                  variant="outlined"
                  dir='ltr'
                  helperText={error?.message}
                  error={!!error}
                />
              )}
            />

          </FormControl>
        </Grid2>

        <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
          <FormControl fullWidth>
            <FormLabel>تخفیف (ریال)</FormLabel>
            <Controller
              name='discountAmount'
              control={control}
              render={({ fieldState: { error }, field: { onChange, value } }) => (
                <NumericFormat
                  value={value}
                  onValueChange={(values) => {
                    onChange(values.floatValue);
                  }}
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  prefix=""
                  variant="outlined"
                  dir='ltr'
                  helperText={error?.message}
                  error={!!error}
                />
              )}
            />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xl: 2, lg: 2, md: 6, sm: 6, xs: 12 }}>
          <FormControl fullWidth>
            <FormLabel>قابل پرداخت (ریال)</FormLabel>
            <NumericFormat
              value={watch('totalAmount') - watch('discountAmount')}
              customInput={TextField}
              thousandSeparator
              valueIsNumericString
              prefix=""
              variant="outlined"
              dir='ltr'
              disabled
            />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
          <FormControl fullWidth>
            <FormLabel>متعهد پرداخت
              {' '}
              <FormLabel sx={{ fontWeight: 500 }} color='error'>
                ({name})
              </FormLabel>
            </FormLabel>
            <Controller
              name="obligatedToPayType"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <RadioGroup
                    row
                    name='obligated_To_Pay_Type'
                    value={value}
                    onChange={(e) => obligatedToPayTypeChange(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value={ObligatedToPayType.Customer}
                      control={<Radio size="small" />}
                      label="بیمه گذار"
                    />
                    <FormControlLabel
                      value={ObligatedToPayType.Marketer}
                      control={<Radio size="small" />}
                      label="بازاریاب"
                    />
                    <FormControlLabel
                      value={ObligatedToPayType.IntroducerOrGarantor}
                      control={<Radio size="small" />}
                      label="معرف / ضامن"
                    />
                  </RadioGroup>
                  {error && (
                    <Typography color="error">{error.message}</Typography>
                  )}
                </>
              )}
            />
          </FormControl>
        </Grid2>

      </Grid2>
      <Divider />

      {/** بیمه عمر و سرمایه */}
      {isLifeInsurance &&
        <Card>
          <CardContent>
            <Divider>
              <Typography variant="h5" component="div" mb={2}>اطلاعات بیمه عمر و سرمایه</Typography>
            </Divider>
            <Grid2 container spacing={2}
              sx={{
                opacity: (canEditCustomer || canEditInsurance) ? 0.6 : 1,
                pointerEvents: (canEditCustomer || canEditInsurance) ? 'none' : 'auto'
              }}
            >

              <Grid2 size={{ xl: 2, lg: 2, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>روش پرداخت بیمه عمر</FormLabel>
                  <Controller
                    name="paymentFrequencyType"
                    control={control}
                    render={({ fieldState: { error }, field: { value, onChange } }) => (
                      <PaymentFrequencyAutoComplete
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={{ xl: 2, lg: 2, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>مدت بیمه نامه به سال</FormLabel>
                  <Controller
                    name='lifeInsuranceYear'
                    control={control}
                    render={({ fieldState: { error }, field: { onChange, value } }) => (
                      <NumericFormat
                        value={value}
                        onValueChange={(values) => {
                          onChange(values.floatValue);
                        }}
                        customInput={TextField}
                        thousandSeparator
                        valueIsNumericString
                        prefix=""
                        variant="outlined"
                        dir='ltr'
                      />
                    )}
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={{ xl: 2, lg: 2, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>درصد تعدیل</FormLabel>
                  <Controller
                    name='lifeAdjustmentPercent'
                    control={control}
                    render={({ fieldState: { error }, field: { onChange, value } }) => (
                      <NumericFormat
                        value={value}
                        onValueChange={(values) => {
                          onChange(values.floatValue);
                        }}
                        customInput={TextField}
                        thousandSeparator
                        valueIsNumericString
                        prefix=""
                        variant="outlined"
                        dir='ltr'
                      />
                    )}
                  />
                </FormControl>
              </Grid2>

              {/* <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>تاریخ شروع (قسط)</FormLabel>
                  <Controller
                    name={`customerSideInstallment.installmentStartDate`}
                    control={control}
                    render={({ field }) => (
                      <MyDatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormControl>
              </Grid2> */}
            </Grid2>
            {/* دکمه نمایش جدول اقساط */}
            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Button
                onClick={() => setOpenDialog(true)}
                size="small"
                variant="contained"
                endIcon={<Visibility />}
              >
                نمایش اقساط
              </Button>
            </Stack>
            <DisplayInstalmentTableDialog
              title={'لیست اقساط '}
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              calculationData={getCurrentInstallmentData()}
            />
          </CardContent>
        </Card>
      }

      <Grid2 container spacing={1}
        sx={{
          display: isLifeInsurance ? 'none' : ''
        }}>

        <Grid2 size={5}
          sx={{
            opacity: canEditCustomer ? 0.6 : 1,
            pointerEvents: canEditCustomer ? 'none' : 'auto'
          }}
        >
          <PolicyInstallment
            title=' پرداخت بیمه گذار (اقساطی / نقد)'
            installmentSideType={InstallmentSideType.Customer}
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

        <Grid2 size={5}
          sx={{
            opacity: canEditInsurance ? 0.6 : 1,
            pointerEvents: canEditInsurance ? 'none' : 'auto'
          }}
        >
          <PolicyInstallment
            title='تسویه با بیمه (اقساطی / نقد)'
            installmentSideType={InstallmentSideType.Insurance}
          />
        </Grid2>
      </Grid2>

      {/**تنظیمات کارمزد */}
      <Dialog
        maxWidth='md'
        fullWidth
        open={openFeeDialog}
        keepMounted
        onClose={() => onCloseFeeDialog(false)}
      >
        <DialogContent>
          <FeeForm />
        </DialogContent>
        <DialogActions>
          <Button size='small' onClick={() => onCloseFeeDialog(false)} variant='contained' color='primary'>ثبت</Button>
        </DialogActions>
      </Dialog>


    </>
  )
}
