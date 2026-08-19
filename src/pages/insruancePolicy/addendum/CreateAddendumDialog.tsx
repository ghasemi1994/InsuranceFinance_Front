import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControl,
  FormLabel, Grid2, TextareaAutosize, TextField, Tooltip,
  Typography, useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import AddendumTypeAutoComplete from '../../../components/common/dropDown/AddendumTypeAutoComplete';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';
import { toPersianDate } from '../../../utils/convertion';
import {
  AddendumRequest,
  AddendumResponse,
  AddendumType,
  IInsurancePolicyResponse,
  PrePaymentType
} from '../../../types/Insurance';
import { Controller, useForm } from 'react-hook-form';
import AttachmentFileList from '../../attachment/AttachmentFileList';
import { NumericFormat } from 'react-number-format';
import toast from 'react-hot-toast';
import { createAddendum } from '../../../server/services/insuranceService';
import { PaymentType } from '@/types/Enums';
import PaymentTypeDialog from './PaymentTypeDialog';


interface IProps {
  open: boolean,
  onClose: (open: boolean) => void
  insurance: IInsurancePolicyResponse | null
  addendumList: AddendumResponse[] | []
}



export default function CreateAddendumtDialog({ onClose, open, insurance, addendumList }: IProps) {

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAmountField, setShowAmountField] = useState(false);
  const [showPaymentTypeDialog, setShowPaymentTypeDialog] = useState(false);

  const defaultValues: AddendumRequest = {
    premiumChangeAmount: null,
    addendumNo: '',
    addendumType: null,
    files: [],
    fullDescription: '',
    issuedDate: toPersianDate(new Date()),
    shortDescription: '',
    policyId: null,
    discountAmount: null,
    insurancePaymentType: PaymentType.Cash,
    customerPaymentType: PaymentType.Cash,
    customerSideInstallment: {
      prePaymentType: PrePaymentType.Percentage,
      prePaymentValue: 30,
      prePaymentStartDate: toPersianDate(new Date()),
      installmentStartDate: toPersianDate(new Date()),
      installmentCount: 5,
      intervalBetweenInstalment: 1,
    },
    insuranceSideInstallment: {
      prePaymentType: PrePaymentType.Percentage,
      prePaymentValue: 30,
      prePaymentStartDate: toPersianDate(new Date()),
      installmentCount: 5,
      intervalBetweenInstalment: 1,
      installmentStartDate: toPersianDate(new Date()),
    }
  }

  const handleClose = () => {
    onClose(false);
  }

  const { control, handleSubmit, setValue, reset, formState, watch } = useForm<AddendumRequest>({
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (open) {
      const addendumNo = insurance?.insuranceNo;
      if (addendumList.length > 0) {

      }
      setValue('addendumNo', addendumNo ?? '');
      setValue('policyId', insurance?.id ?? null);

    } else {
      reset(defaultValues);
    }
  }, [insurance?.insuranceNo, open, setValue])


  const onSubmit = async (req: AddendumRequest) => {
    if (files.length > 0)
      req.files = files;

    try {
      setLoading(true);
      await createAddendum(req).then(() => {
        handleClose();
        toast.success('الحاقیه با موفقیت ثبت شد');
      });
    } catch {
    } finally { setLoading(false); }
  }

  const handleEndorsementTypeChange = (type: AddendumType | null) => {
    setValue('addendumType', type);
    if (type === AddendumType.WithFinancial)
      setShowAmountField(true)
    else
      setShowAmountField(false);
  }

  const theme = useTheme();


  return (
    <>
      <Dialog
        maxWidth='md'
        fullWidth
        open={open}
        keepMounted
        onClose={handleClose}
        component={'form'}
        onSubmit={handleSubmit(onSubmit)}
      >

        <PaymentTypeDialog
          open={showPaymentTypeDialog}
          onClose={() => setShowPaymentTypeDialog(false)}
          setValue={setValue}
          watch={watch}
          control={control}
        />

        <DialogTitle component={Divider} color='textDisabled' mb={2}>
          ثبت الحاقیه جدید / {insurance?.insuranceNo}
        </DialogTitle>

        <DialogContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>نوع الحاقیه</FormLabel>
                <Controller
                  name='addendumType'
                  rules={{ required: 'فیلد اجباری است' }}
                  control={control}
                  render={({ fieldState: { error }, field: { onChange, value } }) => (
                    <AddendumTypeAutoComplete
                      onChange={(e) => handleEndorsementTypeChange(e)}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>تاریخ صدور الحاقیه</FormLabel>
                <Controller
                  name='issuedDate'
                  rules={{ required: 'فیلد اجباری است' }}
                  control={control}
                  render={({ fieldState: { error }, field: { onChange, value } }) => (
                    <MyDatePicker
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid2>
            <Tooltip title={!showAmountField ? 'شما نمی توانید مبلغی را وارد کنید' : ''}>
              <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>مبلغ (+/-)</FormLabel>
                  <Controller
                    name='premiumChangeAmount'
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
                        //helperText={error ? error.message : numberToPersianWords(value ?? 0, 'Toman')}
                        helperText={error?.message}
                        error={!!error}
                        disabled={!showAmountField}
                      />
                    )}
                  />
                </FormControl>
              </Grid2>
            </Tooltip>
            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>شماره الحاقیه</FormLabel>
                <Controller
                  name='addendumNo'
                  rules={{ required: 'فیلد اجباری است' }}
                  control={control}
                  render={({ fieldState: { error }, field: { onChange, value } }) => (
                    <TextField
                      dir='ltr'
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={12}>
              <FormControl fullWidth>
                <FormLabel>شرح کوتاه</FormLabel>
                <Controller
                  name='shortDescription'
                  rules={{ required: 'فیلد اجباری است' }}
                  control={control}
                  render={({ fieldState: { error }, field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid2>

            <Grid2 size={12}>
              <FormControl fullWidth>
                <Controller
                  name='fullDescription'
                  rules={{ required: 'فیلد اجباری است' }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextareaAutosize
                      onChange={onChange}
                      value={value?.toString()}
                      minRows={4}
                      placeholder="توضیحات خود را وارد کنید..."
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        padding: "12px",
                        outline: "none",
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    />
                  )}
                />
                <Typography color='error'>{formState.errors.fullDescription?.message}</Typography>
              </FormControl>
            </Grid2>
            <Grid2 size={12}>
              <AttachmentFileList
                entityType='Addendum'
                setFiles={setFiles}
              />
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowPaymentTypeDialog(true)}
            disabled={!showAmountField}
          >نوع پرداخت</Button>
          <Button
            color='success'
            variant='contained'
            type='submit'
            loading={loading}
          >ثبت الحاقیه</Button>
          <Button
            variant='contained'
            onClick={handleClose}
            color='inherit'
          >انصراف</Button>
        </DialogActions>

      </Dialog>
    </>
  )
}
