import MyDataGrid from '@/components/common/dataGrid/MyDataGrid';
import VehicleTypeAutoComplete from '@/components/common/vehicle/VehicleTypeAutoComplete'
import VehicleTypeBrandAutoComplete from '@/components/common/vehicle/VehicleTypeBrandAutoComplete'
import { createVehicleTip, getVehicleTypeModel } from '@/server/services/vehicleService';
import { ICreateVehicleTip, IVehicleTypeModelResponse } from '@/types/Vehicle';
import { Button, Card, FormControl, FormLabel, Grid2, Stack, TextField } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import BrandDialog from './BrandDialog';

export default function VehicleIndex() {

  const [tipList, setTipList] = useState<IVehicleTypeModelResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);


  const { control, handleSubmit, setValue, watch, reset } = useForm<ICreateVehicleTip>({
    defaultValues: {
      tipName: '',
      typeBrandId: null,
      typeId: null
    }
  });

  const onSubmit = async (data: ICreateVehicleTip) => {
    setLoading(true);
    createVehicleTip(data).then(() => {
      if (data) {
        toast.success('operation was successfully');
        getVehicleTip();
        setValue('tipName', '');
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    if (watch('typeId') && watch('typeBrandId'))
      getVehicleTip();
  }, [watch('typeId'), watch('typeBrandId')])

  const getVehicleTip = () => {
    try {
      if (watch('typeId') && watch('typeBrandId')) {
        setLoading(true);
        getVehicleTypeModel(watch('typeId') ?? 0, watch('typeBrandId') ?? 0)
          .then((response) => {
            setTipList(response?.data);
            setLoading(false);
          });
      }
    } catch { setLoading(false); }
  }

  const columns: GridColDef<IVehicleTypeModelResponse>[] = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1.5,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
    },
  ]

  const [refresh, setRefresh] = useState<number>();

  return (
    <>
      {
        <BrandDialog
          open={open}
          onClose={() => {
            setOpen(false);
            setRefresh(new Date().getTime());
          }}
          vehicleTypeId={watch('typeId') ?? -1}
        />
      }

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>

            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>نوع</FormLabel>
                <Controller
                  control={control}
                  name='typeId'
                  rules={{ required: 'فیلد اجباری' }}
                  render={() =>
                    <VehicleTypeAutoComplete
                      onChange={(e) => setValue('typeId', e)}
                      value={watch('typeId')}
                    />
                  }
                />
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>برند</FormLabel>
                <Controller
                  control={control}
                  name='typeBrandId'
                  rules={{ required: 'فیلد اجباری' }}
                  render={() =>
                    <VehicleTypeBrandAutoComplete
                      vehicleTypeId={watch('typeId')}
                      onChange={(e) => setValue('typeBrandId', e)}
                      value={watch('typeBrandId')}
                      refreshTrigger={refresh}
                    />
                  }
                />

              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>تیپ</FormLabel>
                <Controller
                  control={control}
                  name='tipName'
                  rules={{
                    required: 'فیلد اجباری'
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) =>
                    <TextField
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  }
                />
              </FormControl>
            </Grid2>

            <Stack sx={{ alignItems: 'end', justifyContent: 'space-between', flexDirection: 'row', gap: 1, width: '100%' }}>
              <Button
                color='primary'
                type='button'
                variant='contained'
                onClick={() => watch('typeId') ? setOpen(true) : toast.error('ابتدا نوع را انتخاب کنید')}>Add Brand</Button>

              <Button
                color='success'
                type='submit'
                variant='contained'
                loading={loading}>Save (TipName)</Button>
            </Stack>

          </Grid2>
        </form>
      </Card>

      <MyDataGrid
        columns={columns}
        rows={tipList}
        getRowId={(row) => row.id}
        pagination={false}
        initialPageSize={1000}
        loading={loading}
      />

    </>
  )
}
