import React, { useEffect, useState } from 'react'
import { GridActionsCellItem, GridColDef, GridFilterModel, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { Button, Chip, Grid2, Stack, Tooltip } from '@mui/material';
import { Add, Filter } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { IPersonResponse, PersonGroupType } from '../../types/Person';
import { usePeopleStore } from '../../stores/peopleStore';
import UploadDialog from './components/UploadDialog';
import FilterPanel from './components/FilterPanel';
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid';
import CreateOrUpdateDialog from './components/CreateOrUpdate';
import { digitSeprator, numberToPersianWords } from '../../utils/text';
import { deletePerson } from '@/server/services/personService';


export default function IndividualManagement() {
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedData, setSelectedData] = useState<IPersonResponse | null>(null);
  const { status, dataList, getList } = usePeopleStore();
  const [queryOptions, setQueryOptions] = React.useState({});

  const handleOpen = () => {
    setSelectedData(null);
    setOpen(true);
  }


  useEffect(() => {
    if (status === 'idle')
      getList('', '', '', null, null);
  }, [])

  const handleEdit = (row: IPersonResponse) => {
    setOpen(true);
    setSelectedData(row ?? null);
  };

  const handleOpenUploadDialog = (row: IPersonResponse) => {
    setOpenUpload(true);
    setSelectedData(row ?? null);
  }

  const onDeleteHandleClick = async (row: IPersonResponse) => {
    try {
      if (confirm('آیا از حذف اطلاعات مطمئن هستید؟')) {
        await deletePerson(row.id).then(() => {
          getList('', '', '', null, null);
        });
      }
    } catch (error) { }
  }

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'نام مشتری',
      width: 200,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'nationalCode',
      headerName: 'شناسه ملی / کد ملی / کد اختصاصی اتباع',
      width: 150,
      renderCell(params) {
        return <span>{
          params.row.personGroupTypeId === 1 ?
            params.row.isForeigner ? params.row.foreignerCode : params.row.nationalCode
            : params.row.nationalId
        }
        </span>
      },
    },
    {
      field: 'dateOfBirth',
      headerName: 'تاریخ تولد',
      width: 100,
    },
    {
      field: 'phoneNumber',
      headerName: 'شماره تلفن',
      width: 120,
    },
    {
      field: 'phoneNumber2',
      headerName: 'شماره تلفن2',
      width: 120,
    },
    {
      field: 'personGroupTypeTitle',
      headerName: 'نوع مشتری',
      width: 100,
      renderCell: (params: GridRenderCellParams<IPersonResponse>) => (
        <Chip
          color={params.row.personGroupTypeId === PersonGroupType.Individual ? 'primary' : 'success'}
          label={params.value} />
      ),
    },
    {
      field: 'ceoFullName',
      headerName: 'نام مدیر عامل',
      width: 150,
    },
    {
      field: 'walletBalance',
      headerName: 'موجودی کیف پول',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<IPersonResponse>) => (
        <Tooltip title={numberToPersianWords(params.value, 'Toman')}>
          <div style={{ direction: 'ltr' }}>
            {digitSeprator(params.value)}
          </div>
        </Tooltip >
      ),
    },
    {
      field: 'action',
      type: 'actions',
      width: 200,
      getActions: (params: GridRowParams<IPersonResponse>) => [
        <GridActionsCellItem
          icon={<Tooltip title="ویرایش"><EditIcon color='primary' /></Tooltip>}
          label="ویرایش"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Tooltip title="آپلود مدارک"><UploadFileIcon color='success' /></Tooltip>}
          label="آپلود مدارک"
          onClick={() => handleOpenUploadDialog(params.row)}
        />,
        <GridActionsCellItem
          icon={<Tooltip title="حذف"><DeleteIcon color='error' /></Tooltip>}
          label="حذف"
          onClick={() => onDeleteHandleClick(params.row)}
        />,
      ],
    }

  ]

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    console.log(filterModel)
    setQueryOptions({ filterModel: { ...filterModel } });
  }, []);

  return (
    <>
      <UploadDialog
        personId={selectedData?.id ?? null}
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        personName={selectedData?.fullName}
      />

      <Stack spacing={1}>

        <Grid2 spacing={2} container>
          <Button
            color='success'
            variant='contained'
            endIcon={<Add />}
            onClick={handleOpen}>ثبت مشتری جدید</Button>
        </Grid2>

        <FilterPanel />

        <MyDataGrid
          filterMode='client'
          onFilterModelChange={(model) => onFilterChange(model)}
          loading={status === 'loading' ? true : false}
          columns={columns}
          rows={dataList}
          getRowId={(row) => row.id}
          initialPageSize={50}
        />
      </Stack>

      <CreateOrUpdateDialog
        onClose={() => setOpen(false)}
        open={open}
        data={selectedData}
      />



    </>
  )
}
