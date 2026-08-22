import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, FormControl, FormLabel, Grid2, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import { useInsurancePolicyStore } from '../../stores/insurancePolicyStore';
import { DepositStatus, IInsurancePolicyResponse, InstallmentSideType, PolicyInstallmentPrintData } from '../../types/Insurance';
import { digitSeprator, numberToPersianWords } from '../../utils/text';
import { PaymentType } from '../../types/Enums';
import {
  Add, AddCard, CreditCard,
  Delete,
  ExpandMore,
  FormatAlignJustify, Group,
  ImportExport,
  Print,
  RestartAlt,
  Search,
} from '@mui/icons-material';
import DisplayFormValueDialog from './components/DisplayFormValueDialog';
import GroupPolicyPaymentDialog from './components/payment/GroupPolicyPaymentDialog';
import SinglePolicyPaymentDialog from './components/payment/SinglePolicyPaymentDialog';
import CreateOrUpdateDialog from './CreateOrUpdateDialog';
import { deleteById, getInstallmentPrintData, getInsurancePolicyExcelData } from '../../server/services/insuranceService';
import toast from 'react-hot-toast';
import DepositWalletDialog from '../../components/common/wallet/DepositWalletDialog';
import { NumericFormat } from 'react-number-format';
import CategoryAutoComplete from '../../components/common/dropDown/CategoryAutoComplete';
import PeopleAutoComplete from '../../components/common/dropDown/PeopleAutoComplete';
import PrintableInstallment from './components/PrintableInstallment';
import usePrintable from '@/hooks/usePrintable';
import { downloadByteArrayToFile } from '@/utils/export';
import MarketerAutoComplete from '@/components/common/dropDown/MarketerAutoComplete';
import { Can } from '@/auth/Can';
import { Permissions } from '@/auth/permissions';


export default function Insurance() {

  const navigate = useNavigate();
  const [openFormValueDialog, setOpenFormValueDialog] = useState(false);
  const [openPolicyPaymentDialog, setOpenPolicyPaymentDialog] = useState(false);
  const [openGroupPaymentDialog, setOpenGroupPaymentDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openCreateorUpdate, setOpenCreateOrUpdate] = useState(false);

  const [currentRow, setCurrentRow] = useState<IInsurancePolicyResponse | null>(null);
  const { dataList, getList, status, filter, setFilter } = useInsurancePolicyStore();
  const [printData, setPrintData] = useState<PolicyInstallmentPrintData | null>(null);
  const { componentRef, handlePrint } = usePrintable();
  const [policyRenewal, setPolicyRenewal] = useState(false);

  const columns: GridColDef[] = [
    {
      headerName: 'عملیات',
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params: GridRowParams<IInsurancePolicyResponse>) => [
        <GridActionsCellItem
          disabled={params.row.paymentTypeId === PaymentType.Cash && params.row.paymentTypeId === PaymentType.Cash}
          icon={<Tooltip title="اقساط"><ListIcon color='secondary' /></Tooltip>}
          label="اقساط"
          onClick={() => handleOpenInstallmentDialog(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="ویرایش">
              <EditIcon color={params.row.depositStatus !== DepositStatus.Complete ? 'primary' : 'disabled'} />
            </Tooltip>}
          label="ویرایش"
          onClick={() => handleEditClick(params.row)}
          showInMenu
          disabled={params.row.depositStatus === DepositStatus.Complete}
        />,
        <GridActionsCellItem
          disabled={params.row.formId === null}
          icon={<Tooltip title="نمايش اطلاعات فرم"><FormatAlignJustify color='error' /></Tooltip>}
          label="نمايش اطلاعات فرم"
          onClick={() => handleOpenFormValueDialog(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<Tooltip title="حذف"><Delete color='error' /></Tooltip>}
          label="حذف"
          onClick={() => handleDelete(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<Tooltip title="تمدید بیمه نامه">
            <RestartAlt color='success' />
          </Tooltip>
          }
          label="تمدید بیمه نامه"
          onClick={() => handlePolicyRenewal(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="پرداخت">
              <AddCard color={params.row.depositStatus !== DepositStatus.Complete ? 'primary' : 'disabled'} />
            </Tooltip>
          }
          label="پرداخت مشتری"
          onClick={() => handlePaymentOpenDialog(params.row)}
          disabled={params.row.depositStatus === DepositStatus.Complete}
        />,
        <GridActionsCellItem
          disabled={params.row.paymentTypeId === PaymentType.Cash}
          icon={<Tooltip title="چاپ اقساط"><Print color={params.row.paymentTypeId === PaymentType.Cash ? 'disabled' : 'primary'} /></Tooltip>}
          label="چاپ اقساط"
          onClick={() => handleInstallmentListPrint(params.row)}
        />,

      ],
    },
    {
      field: 'issueDate',
      headerName: 'تاریخ صدور',
      width: 120,
    },
    {
      field: 'marketer',
      headerName: 'بازاریاب',
      width: 150,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={params.value}>
          <span>
            {params.value}
          </span>
        </Tooltip >
      ),
    },
    {
      field: 'categoryTitle',
      headerName: 'بیمه',
      width: 150,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={params.value}>
          <span>
            {params.value}
          </span>
        </Tooltip >
      ),
    },
    {
      field: 'customerName',
      headerName: 'بیمه گذار',
      width: 250,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={params.value + ' ' + params.row.nationalCode}>
          <span>
            {params.value + ' ' + params.row.nationalCode}
          </span>
        </Tooltip >
      ),
    },
    {
      field: 'paymentTypeTitle',
      headerName: 'نوع تسویه',
      width: 100,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Chip
          color={params.row.paymentTypeId === PaymentType.Cash ? 'success' : 'error'}
          label={params.row.paymentTypeTitle} />
      ),
    },
    {
      field: "depositStatusTitle",
      headerName: "وضعیت تسویه",
      width: 140,
      renderCell: (params: GridRenderCellParams<any>) => {
        let color: "success" | "primary" | "error" | "default" = "default";
        let sx: any = {};

        switch (params.row.depositStatus) {
          case DepositStatus.Complete:
            color = "success";
            break;
          case DepositStatus.InProgress:
            color = "primary";
            break;
          case DepositStatus.Pending:
            color = "default";
            break;
          case DepositStatus.Debt:
            color = "error";
            break;
        }

        return (
          <Chip
            sx={sx}
            color={color}
            label={params.value}
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'totalAmount',
      headerName: 'مبلغ بیمه نامه',
      width: 120,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={numberToPersianWords(params.value, 'Toman')}>
          <span>
            {digitSeprator(params.value)}
          </span>
        </Tooltip >
      ),
    },
    {
      field: 'premiumChangeAmount',
      headerName: 'مبلغ الحاقیه (ها)',
      width: 120,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={numberToPersianWords(params.value, 'Toman')}>
          <div style={{ direction: 'ltr' }}>
            {digitSeprator(params.value)}
          </div>
        </Tooltip >
      ),
    },
    {
      field: 'discountAmount',
      headerName: 'تخفیف (ها)',
      width: 120,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={numberToPersianWords(params.value, 'Toman')}>
          <span>
            {digitSeprator(params.value)}
          </span>
        </Tooltip >
      ),
    },
    {
      field: 'totalAmountPayable',
      headerName: 'مبلغ نهایی',
      width: 120,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={numberToPersianWords((params.row.totalAmount + params.row.premiumChangeAmount) - params.row.discountAmount, 'Toman')}>
          <span>
            {digitSeprator((params.row.totalAmount + params.row.premiumChangeAmount) - params.row.discountAmount)}
          </span>
        </Tooltip >
      ),
    },

    // {
    //   field: 'phoneNumber',
    //   headerName: 'شماره تلفن',
    //   width: 110,
    //   renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
    //     <Tooltip title={params.value}>
    //       <span>
    //         {params.value}
    //       </span>
    //     </Tooltip >
    //   ),
    // },

    // {
    //   field: 'introducer',
    //   headerName: 'معرف',
    //   width: 150,
    //   renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
    //     <Tooltip title={params.value}>
    //       <span>
    //         {params.value}
    //       </span>
    //     </Tooltip >
    //   ),
    // },

    {
      field: 'insuranceNo',
      headerName: 'شماره بیمه',
      width: 180,
      renderCell: (params: GridRenderCellParams<IInsurancePolicyResponse>) => (
        <Tooltip title={params.value}>
          {params.value}
        </Tooltip >
      ),
    },


  ]


  const handleDelete = async (item: IInsurancePolicyResponse) => {
    if (item.depositStatus !== DepositStatus.Pending) {
      toast.error('کاربر گرامی! بیمه نامه دارای اطلاعات مالی می باشد و شما مجاز به حذف نمی باشید');
      return;
    }
    if (confirm('آیا از حذف بیمه نامه مطمئن هستید؟')) {
      await deleteById(item.id).then(() => {
        getList();
        toast.success("بیمه نامه حذف شد");
      });
    }

  }

  const handlePolicyRenewal = (row: IInsurancePolicyResponse) => {
    if (row.depositStatus === DepositStatus.Complete)
      return;
    setCurrentRow(row);
    setPolicyRenewal(true);
    setOpenCreateOrUpdate(true);
  }

  const handleEditClick = (row: IInsurancePolicyResponse) => {
    setCurrentRow(row);
    setOpenCreateOrUpdate(true);
    setPolicyRenewal(false);
  }

  const handleInstallmentListPrint = async (row: IInsurancePolicyResponse) => {
    const toastId = toast.loading('در حال دانلود فایل منتظر بمانید...')
    try {
      await getInstallmentPrintData(row.id).then((res) => {
        const response: PolicyInstallmentPrintData = res?.data;
        setPrintData(response);
        toast.dismiss(toastId);
        setTimeout(() => {
          handlePrint();
        }, 100);
      });
    } catch {
      toast.dismiss(toastId);
    } finally {
      toast.dismiss(toastId);
    }
  }

  const handleOpenInstallmentDialog = (row: IInsurancePolicyResponse) => {
    navigate({
      pathname: '/policy-installment-detail',
      search: `?id=${row.id}`
    })
  }

  const handleOpenFormValueDialog = (row: IInsurancePolicyResponse) => {
    setCurrentRow(row);
    setOpenFormValueDialog(true);
  }

  const handlePaymentOpenDialog = (row: IInsurancePolicyResponse) => {
    if (row.depositStatus === DepositStatus.Complete)
      return;
    setCurrentRow(row);
    setOpenPolicyPaymentDialog(true);
  }

  useEffect(() => {
    if (status === 'idle')
      getList();
  }, [])

  const handleClose = () => {
    setOpenPolicyPaymentDialog(false);
    getList();
  }

  const handleGroupClose = () => {
    setOpenGroupPaymentDialog(false);
    getList();
  }

  const handleCreate = () => {
    setOpenCreateOrUpdate(true);
    setCurrentRow(null);
    setPolicyRenewal(false);

  }


  const handleExportExcelClick = async () => {
    const toastId = toast.loading('در حال آماده سازی فایل اکسل. منتظر بمانید ...')
    try {
      await getInsurancePolicyExcelData(filter).then((response) => {
        if (!response?.data) {
          toast.error('اطلاعات یافت نشد');
        } else {
          downloadByteArrayToFile(response.data, 'insurance_excel_file.xlsx');
        }
        toast.dismiss(toastId)
      });
    } catch (error) {
      toast.dismiss(toastId)
    }

  }

  return (
    <>
      <div style={{ display: 'none' }}>
        <PrintableInstallment
          data={printData}
          ref={componentRef}
        />
      </div>

      <Grid2 width={'100%'} container flexDirection={'row'} justifyContent={'space-between'}>
        <Grid2>
          <Button
            size='small'
            color='primary'
            endIcon={<Add />}
            onClick={handleCreate}
          >ثبت بیمه نامه</Button>
        </Grid2>

        <Stack flexDirection={'row'} gap={1}>
          <Grid2>
            <Button
              color='success'
              variant='contained'
              size='small'
              onClick={handleExportExcelClick}
              endIcon={<ImportExport />}
            >خروجی اکسل</Button>
          </Grid2>
          <Grid2>
            <Button
              color='info'
              variant='contained'
              size='small'
              endIcon={<Group />}
              onClick={() => setOpenGroupPaymentDialog(true)}
            >تسویه گروهی</Button>
          </Grid2>
          <Grid2>
            <Button
              color='info'
              variant='contained'
              size='small'
              onClick={() => setOpenPaymentDialog(true)}
              endIcon={<CreditCard />}
            >شارژ کیف پول</Button>
          </Grid2>
        </Stack>
      </Grid2>

      <Accordion
        defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>{'جستجو'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2 container spacing={1} alignItems={'center'}>
            <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>بیمه گذار</FormLabel>
                <PeopleAutoComplete
                  onChange={(e) => setFilter({ ...filter, personId: e })}
                  value={filter.personId}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>دسته بندی</FormLabel>
                <CategoryAutoComplete
                  onChange={(e) => setFilter({ ...filter, categoryId: e })}
                  value={filter.categoryId}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>کد ملی / شناسه ملی / اتباع</FormLabel>
                <NumericFormat
                  customInput={TextField}
                  variant='outlined'
                  dir='ltr'
                  allowLeadingZeros
                  onChange={(e) => setFilter({ ...filter, nationalCode: e.target.value })}
                  value={filter.nationalCode}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>شماره بیمه نامه</FormLabel>
                <TextField
                  dir='ltr'
                  onChange={(e) => setFilter({ ...filter, insuranceNo: e.target.value })}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>بازاریاب</FormLabel>
                <MarketerAutoComplete
                  onChange={(e) => setFilter({ ...filter, marketerId: e })}
                  value={filter.marketerId}
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>معرف</FormLabel>
                <PeopleAutoComplete
                  onChange={(e) => setFilter({ ...filter, introducerId: e })}
                  value={filter.introducerId}
                />
              </FormControl>
            </Grid2>
          </Grid2>
          <Button
            sx={{ mt: 3 }}
            color='primary'
            variant='contained'
            size='small'
            onClick={() => getList()}
            loading={status === 'loading' ? true : false}
            endIcon={<Search />}
          >جستجو</Button>
        </AccordionDetails>
      </Accordion>

      <MyDataGrid
        columns={columns}
        rows={dataList ?? []}
        getRowId={(row) => row.id}
        rowHeight={72}
        loading={status === 'loading' && true}
      />

      <DisplayFormValueDialog
        policyId={currentRow?.id || null}
        onClose={() => setOpenFormValueDialog(false)}
        open={openFormValueDialog} />

      <SinglePolicyPaymentDialog
        row={currentRow}
        open={openPolicyPaymentDialog}
        onClose={handleClose}
        sideType={InstallmentSideType.Customer}
      />

      <GroupPolicyPaymentDialog
        open={openGroupPaymentDialog}
        onClose={handleGroupClose}
      />

      <DepositWalletDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
      />

      {
        openCreateorUpdate &&
        <CreateOrUpdateDialog
          open={openCreateorUpdate}
          onClose={() => setOpenCreateOrUpdate(false)}
          policyId={currentRow?.id ?? null}
          policyRenewal={policyRenewal}
        />
      }

    </>
  )
}
