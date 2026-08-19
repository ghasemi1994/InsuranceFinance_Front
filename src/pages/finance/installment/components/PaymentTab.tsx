import { AddCard, Receipt } from '@mui/icons-material'
import { Box, Chip, Tooltip } from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams, useGridApiRef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { AddendumRequest, AddendumResponse, IFinanceItem, IInsurancePolicyResponse, InstallmentSideType, PolicyPaymentGroupType } from '../../../../types/Insurance';
import { useInstallmentStore } from '../../../../stores/installmentStore';
import { digitSeprator, numberToPersianWords } from '../../../../utils/text';
import SinglePolicyPaymentDialog from '../../../insruancePolicy/components/payment/SinglePolicyPaymentDialog';
import MyDataGrid from '../../../../components/common/dataGrid/MyDataGrid';
import { getAddendumById, getPolicyById } from '../../../../server/services/insuranceService';
import Filter from '../components/Filter';
import DepositInformationDialog from './DepositInformationDialog';
import toast from 'react-hot-toast';

export default function PaymentTab() {

  const [policy, setPolicy] = useState<IInsurancePolicyResponse | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [installmentItemId, setInstallmentItemId] = useState<number | null>(null);
  const [currentRow, setCurrentRow] = useState<IFinanceItem | null>(null);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [addendum, setAddendum] = useState<AddendumResponse | null>(null);
  const [groupType, setGroupType] = useState<PolicyPaymentGroupType>(PolicyPaymentGroupType.CashGroup);

  const { getFinanceItemList, financeItems } = useInstallmentStore();

  useEffect(() => {
    getData();
  }, [])

  const getData = () => {
    getFinanceItemList();
  }

  const columns: GridColDef[] = [
    {
      width: 150,
      field: "customerName",
      headerName: "بیمه گذار",
      renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      width: 150,
      field: "category",
      headerName: "بیمه",
      renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "companyName",
      headerName: "بیمه گر",
      width: 80
    },
    {
      width: 150,
      field: "insuranceNo",
      headerName: "شماره بیمه نامه",
      renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      width: 150,
      field: "marketer",
      headerName: "بازاریاب",
      renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },

    {
      width: 100,
      field: "dueTitle",
      headerName: "نوع سررسيد"
    },
    {
      width: 100,
      field: "dueDate",
      headerName: "تاريخ سررسيد"
    },
    {
      width: 100, field: "amountPayable", headerName: "قابل پرداخت",
      renderCell: (params: GridRenderCellParams<IFinanceItem>) => (
        <Tooltip title={numberToPersianWords(params.value, 'Rial')}>
          <span>
            {digitSeprator(params.value)}
          </span>
        </Tooltip >
      ),
    },
    {
      width: 100,
      field: "actions",
      headerName: "عملیات",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="پرداخت">
              <AddCard color="primary" />
            </Tooltip>
          }
          label="پرداخت"
          onClick={() => getPolicy(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip
              title={params.row.isPaid ? "نمایش واریزی" : "پرداخت نشده"}
            >
              <Receipt color="action" />
            </Tooltip>
          }
          label="واریزی"
          onClick={() => handleDepositInformation(params.row)}
        />,
      ],
    },
  ];

  const handleDepositInformation = (row: IFinanceItem) => {
    setCurrentRow(row);
    setOpenDepositDialog(true);
  }

  const getPolicy = async (row: IFinanceItem) => {
    try {
      setInstallmentItemId(row.installmentItemId);
      setGroupType(row.policyPaymentGroupType);
      await getPolicyById(row.insurancePolicyId, InstallmentSideType.Insurance).then((res) => {
        setPolicy(res?.data);
        if (row.policyPaymentGroupType === PolicyPaymentGroupType.AddendumGroup) {
          if (!row.addendumId) {
            toast.error('payment incorrect');
            return;
          }
          getAddendum(row.addendumId);
        } else {
          setOpen(true);
        }
      });
    } catch { }
  }

  const getAddendum = async (addendumId: number) => {
    try {
      await getAddendumById(addendumId).then((res) => {
        setAddendum(res?.data);
        setOpen(true);
      })
    } catch {

    }
  }

  const handleClose = () => {
    setOpen(false);
    getData();
    setAddendum(null);
  }

  const depositHandleClose = () => {
    setOpenDepositDialog(false);
    getData();
  }


  return (
    <>

      <DepositInformationDialog
        onClose={depositHandleClose}
        open={openDepositDialog}
        row={currentRow}
        sideType={InstallmentSideType.Insurance}
      />


      {policy &&
        <SinglePolicyPaymentDialog
          open={open}
          onClose={handleClose}
          row={policy}
          defaultInstallmentItemId={installmentItemId ?? null}
          showInstallmentList={false}
          sideType={InstallmentSideType.Insurance}
          addendum={addendum}
          paymentGroupType={groupType}
        />
      }

      <Filter
        sideType={InstallmentSideType.Insurance}
      />

      <Box sx={{ flex: 1, width: "100%", overflowX: "auto" }} mt={2}>
        <MyDataGrid
          initialPageSize={5}
          columns={columns}
          rows={financeItems.dataList ?? []}
          getRowId={(row) => (row.id)}
          rowHeight={65}
          loading={financeItems.status === 'loading' ? true : false}
          sx={{
            '& .MuiDataGrid-row.expired-row': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
              }
            },
            '& .MuiDataGrid-row.paid-row': {
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
              }
            },
            '& .MuiDataGrid-virtualScroller': { overflowX: 'auto' },
          }}
          getRowClassName={(params) =>
            params.row.isDueExpired ? 'expired-row' : params.row.isPaid ? 'paid-row' : ''
          }
          getCellClassName={(params) => params.row.dueTitle ? 'due-title' : ''}
        />
      </Box>
    </>
  )
}
