import {
  Button,
  Chip,
  FormControl,
  FormLabel,
  Grid2,
  List,
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
import { createPerson, getPersonByPhoneNumber, updatePerson, updatePersonApi } from '../../../server/services/personService';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';
import useConfirm from '../../../hooks/useConfirm';


interface IProps {
  data?: IPersonResponse | null,
  onClose: (open: boolean) => void
}
export default function CreateOrUpdateCorporateDialog({ data, onClose }: IProps) {

  const { getList, getForDropdownList } = usePeopleStore();
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const handleClose = () => {
    onClose(false);
  }

  const { control, handleSubmit, setValue, reset } = useForm<IPersonRequest>({
    defaultValues: {
      id: null,
      phoneNumber: '',
      ceoFullName: '',
      companyName: '',
      nationalId: '',
      phoneNumber2: '',
      registrationCode: '',
      registrationDate: null,
      jobAddress: '',
      economicCode: '',
      phoneNumber3: '',
      phoneNumber4: ''
    } as IPersonRequest,
    mode: 'onBlur'
  });


  useEffect(() => {
    if (data) {
      setValue('registrationCode', data.registrationCode)
      setValue('registrationDate', data.registrationDate)
      setValue('jobAddress', data.jobAddress)
      setValue('economicCode', data.economicCode)
      setValue('ceoFullName', data.ceoFullName ?? '');
      setValue('companyName', data.companyName ?? '');
      setValue('nationalId', data.nationalId ?? '');
      setValue('phoneNumber', data.phoneNumber ?? '');
      setValue('phoneNumber2', data.phoneNumber2 ?? '');
      setValue('phoneNumber3', data.phoneNumber3 ?? '');
      setValue('phoneNumber4', data.phoneNumber4 ?? '');
      setValue('id', data.id ?? null);
    }
  }, [data])

  const onSubmit = (req: IPersonRequest) => {
    req.personGroupTypeId = PersonGroupType.Corporate;
    if (data) {
      update(req);
    }
    else {
      insert(req);
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
      setLoading(true);
      await createPerson(data).then(() => {
        reset();
        toast.success('اطلاعات با موفقیت ثبت شد');
        getList('', '', '', null, null);
        getForDropdownList();
        setLoading(false);
        handleClose();
      });
    } catch {
      setLoading(false);
    }
  }


  const update = async (data: IPersonRequest) => {
    try {

      setLoading(true);

      const PEOPLE: IPersonInquiry[] = await getPersonByPhoneNumber(data.phoneNumber)
        .then(res => res.data);

      // فیلتر کردن نتایجی که خود شخص فعلی نباشند
      const otherPeople = PEOPLE.filter(p => p.nationalId !== data.nationalId);

      if (otherPeople.length > 0) {
        const isConfirmed = await confirm({
          title: 'هشدار!',
          content: (
            <Stack sx={{ background: '#f8f8f8', padding: 1 }}>
              <Typography fontWeight={500} component={'h4'} mb={1}>کاربر گرامی!</Typography>
              <Typography>
                شماره تلفن وارد شده قبلا برای شخص/اشخاص زیر ثبت شده است. آیا ادامه می‌دهید؟
              </Typography>
              <List>
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
              </List>
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
      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>نام شرکت</FormLabel>
              <Controller
                control={control}
                name='companyName'
                rules={{ required: 'فیلد اجباری است' }}
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
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>شناسه ملی</FormLabel>
              <Controller
                control={control}
                name='nationalId'
                rules={{ required: 'فیلد اجباری است' }}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                  <TextField variant='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={!!error}
                    helperText={error?.message}
                    dir='ltr'
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>نام مدیر عامل</FormLabel>
              <Controller
                control={control}
                name='ceoFullName'
                rules={{ required: 'فیلد اجباری است' }}
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
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
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
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>شماره تلفن (دوم)</FormLabel>
              <Controller
                control={control}
                name='phoneNumber2'
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
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>کد ثبتی</FormLabel>
              <Controller
                control={control}
                name='registrationCode'
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
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>تاریخ ثبت</FormLabel>
              <Controller
                control={control}
                name='registrationDate'
                render={({ field: { value, onChange }, }) =>
                  <MyDatePicker
                    value={value}
                    onChange={onChange}
                  />
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>کد اقتصادی</FormLabel>
              <Controller
                control={control}
                name='economicCode'
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
          <Grid2 size={{ xl: 12, lg: 12, sm: 12, md: 12, xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>آدرس</FormLabel>
              <Controller
                control={control}
                name='jobAddress'
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
