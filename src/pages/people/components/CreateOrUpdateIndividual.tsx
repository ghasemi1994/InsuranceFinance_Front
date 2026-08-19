import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';
import { IPersonInquiry, IPersonRequest, IPersonResponse, PersonGroupType } from '../../../types/Person';
import { usePeopleStore } from '../../../stores/peopleStore';
import { createPerson, getPersonByPhoneNumber, updatePerson } from '../../../server/services/personService';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';
import useConfirm from '../../../hooks/useConfirm';


interface IProps {
  data?: IPersonResponse | null
  onClose: (open: boolean) => void

}
export default function CreateOrUpdateIndividual({ data, onClose }: IProps) {
  const { getList, getForDropdownList } = usePeopleStore();
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const defaultValues = {
    id: null,
    firstName: '',
    lastName: '',
    nationalCode: '',
    phoneNumber: '',
    dateOfBirth: null,
    foreignerCode: '',
    isForeigner: false,
    fatherName: '',
    homeAddress: '',
    homePostalCode: '',
    phoneNumber3: '',
    phoneNumber4: ''
  } as IPersonRequest

  const { control, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<IPersonRequest>({
    defaultValues: defaultValues,
    mode: 'onBlur'
  });

  useEffect(() => {
    if (data) {
      setValue('firstName', data.firstName ?? '');
      setValue('lastName', data.lastName ?? '');
      setValue('nationalCode', data.nationalCode ?? '');
      setValue('phoneNumber', data.phoneNumber ?? '');
      setValue('id', data.id ?? null);
      setValue('dateOfBirth', data.dateOfBirth);
      setValue('isForeigner', data.isForeigner);
      setValue('foreignerCode', data.foreignerCode);
      setValue('homePostalCode', data.homePostalCode);
      setValue('homeAddress', data.homeAddress);
      setValue('fatherName', data.fatherName);
      setValue('phoneNumber3', data.phoneNumber3);
      setValue('phoneNumber4', data.phoneNumber4);

    } else {
      reset(defaultValues)
    }
  }, [data])

  const handleClose = () => {
    onClose(false);
  }

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  const onSubmit = (req: IPersonRequest) => {
    req.personGroupTypeId = PersonGroupType.Individual;
    const requestData = {
      ...req,
      dateOfBirth: req.dateOfBirth,
    } as IPersonRequest;

    if (data) {
      update(requestData);
    }
    else {
      insert(requestData);
    }
  }



  const insert = async (data: IPersonRequest) => {
    try {
      setLoading(true);

      const PEOPLE: IPersonInquiry[] = await getPersonByPhoneNumber(data.phoneNumber)
        .then(res => res.data);

      // اگر شماره موجود بود، هشدار و تایید بگیریم
      if (PEOPLE.length > 0) {
        const isConfirmed = await confirm({
          title: 'هشدار!',
          content: (
            <Stack sx={{ background: '#f8f8f8', padding: 1 }}>
              <Typography fontWeight={500} component={'h4'} mb={1}>کاربر گرامی!</Typography>
              <Typography>
                شماره تلفن وارد شده قبلا برای شخص/اشخاص زیر ثبت شده است. آیا ادامه می‌دهید؟
              </Typography>
              {PEOPLE.map(item => (
                <ListItem key={item.personGroupTypeId === PersonGroupType.Corporate ? item.nationalId : item.nationalCode}>
                  <ListItemText>
                    {item.fullName} {' | '}
                    {item.personGroupTypeId === PersonGroupType.Corporate ? item.nationalId : item.nationalCode}
                    {' | '}
                    {item.personGroupTypeTitle}
                  </ListItemText>
                </ListItem>
              ))}
            </Stack>
          ),
          confirmationText: 'بله، ادامه می‌دهم',
          cancellationText: 'نه، انصراف',
        });

        if (!isConfirmed) {
          setLoading(false);
          return;
        }
      }

      await addPerson(data);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const addPerson = async (data: IPersonRequest) => {
    try {
      await createPerson(data);
      reset();
      toast.success('اطلاعات با موفقیت ثبت شد');
      getList('', '', '', null, null);
      getForDropdownList();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const update = async (data: IPersonRequest) => {
    try {
      setLoading(true);

      const PEOPLE: IPersonInquiry[] = await getPersonByPhoneNumber(data.phoneNumber)
        .then(res => res.data);

      // فیلتر کردن نتایجی که خود شخص فعلی نباشند
      const otherPeople = PEOPLE.filter(p => p.nationalCode !== data.nationalCode);

      if (otherPeople.length > 0) {
        const isConfirmed = await confirm({
          title: 'هشدار!',
          content: (
            <Stack sx={{ background: '#f8f8f8', padding: 1 }}>
              <Typography fontWeight={500} component={'h4'} mb={1}>کاربر گرامی!</Typography>
              <Typography>
                شماره تلفن وارد شده قبلا برای شخص/اشخاص زیر ثبت شده است. آیا ادامه می‌دهید؟
              </Typography>
              {otherPeople.map(item => (
                <ListItem key={item.personGroupTypeId === PersonGroupType.Corporate ? item.nationalId : item.nationalCode}>
                  <ListItemText>
                    {item.fullName} {' | '}
                    {item.personGroupTypeId === PersonGroupType.Corporate ? item.nationalId : item.nationalCode}
                    {' | '}
                    {item.personGroupTypeTitle}
                  </ListItemText>
                </ListItem>
              ))}
            </Stack>
          ),
          confirmationText: 'بله، ادامه می‌دهم',
          cancellationText: 'نه، انصراف',
        });

        if (!isConfirmed) {
          setLoading(false);
          return;
        }
      }

      await updatePerson(data);
      toast.success('اطلاعات با موفقیت ویرایش شد');
      getList('', '', '', null, null);
      getForDropdownList();
      handleClose();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />

      <form onSubmit={handleFormSubmit}>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>نام</FormLabel>
              <Controller
                control={control}
                name='firstName'
                rules={{
                  required: 'فیلد اجباری', minLength: {
                    value: 2,
                    message: 'حداقل ۲ کاراکتر وارد کنید'
                  },
                }}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                  <TextField
                    variant='outlined'
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error?.message}
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>نام خانوادگی</FormLabel>
              <Controller
                control={control}
                name='lastName'
                rules={{
                  required: 'فیلد اجباری', minLength: {
                    value: 2,
                    message: 'حداقل ۲ کاراکتر وارد کنید'
                  },
                }}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                  <TextField variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={!!error}
                    helperText={error?.message}
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>کد ملی</FormLabel>
              <Controller
                control={control}
                name='nationalCode'
                render={({ field: { value, onChange, onBlur } }) =>
                  <NumericFormat
                    customInput={TextField}
                    variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    dir='ltr'
                    allowLeadingZeros
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>شماره تلفن</FormLabel>
              <Controller
                control={control}
                name='phoneNumber'
                rules={{
                  required: 'فیلد اجباری', pattern: {
                    value: /^\d{11}$/,
                    message: ' شماره تلفن باید 11 رقم باشد'
                  }
                }}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                  <NumericFormat
                    customInput={TextField}
                    variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={!!error}
                    helperText={error?.message}
                    dir='ltr'
                    allowLeadingZeros
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>تاریخ تولد</FormLabel>
              <Controller
                control={control}
                name='dateOfBirth'
                render={({ field: { value, onChange }, fieldState: { error } }) =>
                  <MyDatePicker
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error?.message}
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>اتباع می باشد؟</FormLabel>
              <Controller
                control={control}
                name='isForeigner'
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color='error'
                        onChange={onChange}
                        value={value}
                        checked={value}
                      //defaultChecked={value}
                      />
                    }
                    label="اتباع می باشد؟"
                  />
                )}
              />
            </FormControl>
          </Grid2>

          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>کد اختصاصی اتباع</FormLabel>
              <Controller
                control={control}
                name='foreignerCode'
                render={({ field: { value, onChange, onBlur } }) =>
                  <TextField variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    dir='ltr'
                  />
                }
              />
            </FormControl>
          </Grid2>

          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>نام پدر</FormLabel>
              <Controller
                control={control}
                name='fatherName'
                render={({ field: { value, onChange, onBlur } }) =>
                  <TextField variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                }
              />
            </FormControl>
          </Grid2>

          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>کد پستی</FormLabel>
              <Controller
                control={control}
                name='homePostalCode'
                render={({ field: { value, onChange, onBlur } }) =>
                  <TextField variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    dir='ltr'
                  />
                }
              />
            </FormControl>
          </Grid2>


          <Grid2 size={{ xl: 9, lg: 9, sm: 12, md: 9, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>آدرس</FormLabel>
              <Controller
                control={control}
                name='homeAddress'
                render={({ field: { value, onChange, onBlur } }) =>
                  <TextField variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>شماره تلفن ثابت 1</FormLabel>
              <Controller
                control={control}
                name='phoneNumber3'
                render={({ field: { value, onChange, onBlur } }) =>
                  <NumericFormat
                    customInput={TextField}
                    variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    dir='ltr'
                    allowLeadingZeros
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>شماره تلفن ثابت 2</FormLabel>
              <Controller
                control={control}
                name='phoneNumber4'
                render={({ field: { value, onChange, onBlur } }) =>
                  <NumericFormat
                    customInput={TextField}
                    variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    dir='ltr'
                    allowLeadingZeros
                  />
                }
              />
            </FormControl>
          </Grid2>

        </Grid2>

        <Grid2 mt={2}>
          <Button
            type='submit'
            color='success'
            variant='contained'
            size='small'
            loading={loading}>ثبت</Button>
        </Grid2>

      </form>
    </>
  )
}
