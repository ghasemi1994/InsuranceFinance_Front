import {
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid2,
  Stack,
  TextField,
  Tooltip
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import PeopleAutoComplete from '../../components/common/dropDown/PeopleAutoComplete';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid';
import { ICompanyAgencyRequest, ICompanyAgencyResponse, ICompanyResponse } from '../../types/Company';
import { createCompanyAgency, deleteAgency, getCompanyAgencyList, updateCompanyAgency } from '../../server/services/companyService';
import toast from 'react-hot-toast';
import { AccountBalance, Edit } from '@mui/icons-material';
import CompanyAgencyBankAccountDialog from './CompanyAgencyBankAccountDialog';


interface IProps {
  open: boolean
  onClose: (open: boolean) => void,
  company: ICompanyResponse | null
}


export default function CompanyAgencyDialog(props: IProps) {

  const { open, onClose, company } = props;

  const defaultValues = {
    accountNumber: '',
    bankId: null,
    cardNumber: '',
    code: '',
    personId: null,
    shebaNumber: '',
    companyId: company?.id
  } as ICompanyAgencyRequest



  const { control, handleSubmit, setValue, reset } = useForm<ICompanyAgencyRequest>({ defaultValues: defaultValues });

  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<Array<ICompanyAgencyResponse>>([]);

  const [formState, setFormState] = useState<'add' | 'edit'>('add');

  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [currentCompanyAgency, setCurrentCompanyAgency] = useState<ICompanyAgencyResponse | null>();

  useEffect(() => {
    if (open) {
      setFormState('add');
      getData();
      reset(defaultValues)
      setValue('companyId', company?.id ?? 0);
    }
  }, [open])

  const getData = async () => {
    try {
      await getCompanyAgencyList(company?.id ?? 0).then((res) => {
        setData(res.data);
      });
    } catch { }
  }

  const handleClose = () => {
    onClose(false);
  };

  const onSubmit = async (data: ICompanyAgencyRequest) => {
    if (formState === 'add')
      submitAddForm(data);
    else
      submitEditForm(data);
  }

  {/**edit form */ }
  const submitEditForm = async (data: ICompanyAgencyRequest) => {
    try {
      setLoading(true);
      await updateCompanyAgency(data).then(() => {
        setLoading(false);
        getData();
        reset(defaultValues);
        setFormState('add');
        toast.success('اطلاعات با موفقیت ویرایش شد');
      });
    } catch {
      setLoading(false);
    }
  }

  {/**add form */ }
  const submitAddForm = async (data: ICompanyAgencyRequest) => {
    try {
      setLoading(true);
      await createCompanyAgency(data).then(() => {
        setLoading(false);
        getData();
        reset(defaultValues);
        toast.success('اطلاعات با موفقیت ثبت شد');
      });
    } catch {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('از حذف اطلاعات مطمئن هستید؟') === true) {
      await deleteAgency(id).then(() => {
        toast.success('اطلاعات حذف شد');
        getData();
      });
    }
  };

  const handleAddAcount = (item: ICompanyAgencyResponse) => {
    setCurrentCompanyAgency(item);
    setOpenAccountDialog(true);
  }

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'کد نمایندگی',
      flex: 1.5,
    },
    {
      field: 'fullName',
      headerName: 'نام و نام خانوادگی',
      flex: 2,
    },
    {
      field: 'nationalCode',
      headerName: 'کد ملی',
      flex: 1.5,
    },
    {
      field: 'phoneNumber',
      headerName: 'تلفن',
      flex: 1.5,
    },
    {
      field: 'bankName',
      headerName: 'بانک',
      flex: 1.5,
    },
    {
      field: 'action',
      headerName: 'عملیات',
      flex: 1.5,
      filterable: false,
      sortable: false,
      type: 'actions',
      getActions: (params: any) => [
        <Tooltip title='حذف'>
          <GridActionsCellItem
            icon={<DeleteIcon color='error' />}
            label="Delete"
            onClick={() => handleDelete(params.id)}
            showInMenu={false}
          />
        </Tooltip>,
        <Tooltip title='ویرایش'>
          <GridActionsCellItem
            icon={<Edit color='primary' />}
            label="Edit"
            onClick={() => handleEdit(params.row)}
            showInMenu={false}
          />
        </Tooltip>,
        <Tooltip title='افزودن حساب'>
          <GridActionsCellItem
            icon={<AccountBalance color='success' />}
            label="AddAcount"
            onClick={() => handleAddAcount(params.row)}
            showInMenu={false}
          />
        </Tooltip>
      ]
    },
  ]

  const handleEdit = (item: ICompanyAgencyResponse) => {
    setFormState('edit');
    setValue('id', item.id);
    setValue('code', item.code);
    setValue('personId', item.personId);
  }

  const handleCancelClick = () => {
    reset(defaultValues);
    setFormState('add');
  }


  return (
    <>


      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="dialog-person"
      >
        <DialogTitle>{` تعریف نمایندگی برای شرکت (${company?.code}) (${company?.name})`}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>

              <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>اشخاص</FormLabel>
                  <Controller
                    control={control}
                    name='personId'
                    rules={{ required: 'فیلد اجباری' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) =>
                      <PeopleAutoComplete
                        disabled={formState === 'edit' ? true : false}
                        onChange={onChange}
                        value={value}
                        error={!!error}
                        helperText={error?.message}
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={{ lg: 2, xl: 2, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>کد نمایندگی</FormLabel>
                  <Controller
                    control={control}
                    name='code'
                    rules={{ required: 'فیلد اجباری' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) =>
                      <TextField
                        onChange={onChange}
                        value={value}
                        dir='ltr'
                        error={!!error}
                        helperText={error?.message}
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Stack sx={{ alignItems: 'end', justifyContent: 'end', flexDirection: 'row', gap: 1, width: '100%' }}>
                {
                  formState === 'edit'
                    ?
                    <Button type='button' onClick={handleCancelClick} variant='contained' size='small' color='secondary'>انصراف</Button>
                    : ''
                }
                <Button
                  type='submit'
                  color={formState === 'add' ? 'success' : 'primary'}
                  variant='contained'
                  loading={loading}
                  size='small'>
                  {formState === 'add' ? 'ثبت' : 'ویرایش'}
                </Button>
              </Stack>
            </Grid2>
          </form>

          <Box sx={{ marginTop: '10px', width: '100%' }}>
            <MyDataGrid
              loading={loading}
              columns={columns}
              rows={data}
              getRowId={(row) => row.id}
            />
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size='small'>بستن</Button>
        </DialogActions>
      </Dialog>

      <CompanyAgencyBankAccountDialog
        companyAgency={currentCompanyAgency ?? null}
        open={openAccountDialog}
        onClose={() => setOpenAccountDialog(false)}
      />


    </>
  )
}
