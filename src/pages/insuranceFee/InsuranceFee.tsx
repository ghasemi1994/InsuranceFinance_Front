import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid'
import { Tooltip } from '@mui/material'
import EditDialog from './EditDialog'
import { useCategoryStore } from '../../stores/categoryStore'
import EditIcon from '@mui/icons-material/Edit';
import { ICategoryResponse } from '../../types/Category'

export default function InsuranceFee() {

  const [selectedItem, setSelectedItem] = useState<ICategoryResponse>();
  const [open, setOpen] = useState(false);
  const { dataList, status, getList } = useCategoryStore();

  useEffect(() => {
    if (status === 'idle')
      getList();
  }, [])


  const handleEdit = (item: ICategoryResponse) => {
    setSelectedItem(item);
    setOpen(true);
  }

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'کد',
      flex: 0.5,
    },
    {
      field: 'name',
      headerName: 'دسته بندی',
      flex: 5
    },
    {
      field: 'feePercentage',
      headerName: 'درصد کارمزد',
      flex: 1.5,
      renderCell: (params: GridRenderCellParams<ICategoryResponse>) => (
        <span>
          {'%' + params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 1.5,
      getActions: (params: GridRowParams<ICategoryResponse>) => [
        <GridActionsCellItem
          icon={<Tooltip title="ویرایش"><EditIcon color='primary' /></Tooltip>}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,

      ],
    },
  ]

  return (
    <>

      <MyDataGrid
        loading={status === 'loading' ? true : false}
        columns={columns}
        rows={dataList ?? []}
        getRowId={(row) => row.id}
        pagination={false}
        initialPageSize={1000}
      />

      <EditDialog
        onClose={() => setOpen(false)}
        open={open}
        item={selectedItem ?? null}
      />

    </>
  )
}
