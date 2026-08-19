import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid2,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { IMarketerRequest } from '../../types/Person';
import { createMarketer } from '../../server/services/personService';
import toast from 'react-hot-toast';
import { useMarketerStore } from '../../stores/marketerStore';
import PeopleAutoComplete from '../../components/common/dropDown/PeopleAutoComplete';
import UserAutoComplete from '@/components/common/dropDown/UserAutoComplete';


interface IProps {
  open: boolean
  onClose: (open: boolean) => void,
}
export default function CreateDialog(props: IProps) {
  const { open, onClose } = props;
  const { getList } = useMarketerStore();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(open);

  const { control, handleSubmit, reset } = useForm<IMarketerRequest>({
    defaultValues: {
      marketerCode: '',
      userId: null
    }
  });


  useEffect(() => {
    if (open) {
      setOpenDialog(true);
    }
  }, [open])

  const handleClose = () => {
    onClose(false);
    setOpenDialog(false);
    reset();
  };

  const onSubmit = (req: IMarketerRequest) => {
    insert(req);
  }

  const insert = async (data: IMarketerRequest) => {
    try {
      setLoading(true);
      await createMarketer(data).then(() => {
        reset();
        handleClose();
        toast.success('اطلاعات با موفقیت ثبت شد');
        getList();
        setLoading(false);

      });
    } catch {
      setLoading(false);
    }
  }



  return (
    <>
      <Dialog
        maxWidth='sm'
        fullWidth
        open={openDialog}
        keepMounted
        onClose={onClose}
        aria-describedby="dialog-person"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{"ایجاد بازاریاب"}</DialogTitle>
          <DialogContent sx={{ paddingBottom: 5 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <FormControl fullWidth>
                  <FormLabel>اشخاص</FormLabel>
                  <Controller
                    control={control}
                    name='userId'
                    rules={{
                      required: 'فیلد اجباری', minLength: {
                        value: 2,
                        message: 'حداقل ۲ کاراکتر وارد کنید'
                      },
                    }}
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                      // <PeopleAutoComplete
                      //   onChange={onChange}
                      //   value={value}
                      //   error={!!error}
                      //   helperText={error?.message}
                      // />
                      <UserAutoComplete
                        onChange={onChange}
                        value={value}
                        error={!!error}
                        helperText={error?.message}
                      />
                    }
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={6}>
                <FormControl fullWidth>
                  <FormLabel>کد بازاریابی</FormLabel>
                  <Controller
                    control={control}
                    name='marketerCode'
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
                        dir='ltr'
                      />
                    }
                  />
                </FormControl>
              </Grid2>
            </Grid2>
          </DialogContent>
          <DialogActions>
            <Button type='submit' color='success' variant='contained' size='small' loading={loading}>ثبت</Button>
            <Button size='small' onClick={handleClose} disabled={loading}>بستن</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
