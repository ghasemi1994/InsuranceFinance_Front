import { useReminderStore } from '@/stores/reminderStore'
import { AddCard, NotificationsActive, NotificationsNone, RemoveRedEyeOutlined, RestartAlt, ViewAgenda } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextareaAutosize,
  Tooltip,
  Typography
} from '@mui/material'

import { GridActionsCellItem, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import MyDataGrid from '../../common/dataGrid/MyDataGrid';
import { ReminderCategoryResponse } from '@/types/Reminder';
import { getTemplateView, rejectReminder, sendReminderSms, updateTemplate } from '@/server/services/reminderService';
import { RejectReminderRequest, SendReminderSmsRequest } from '@/types/Reminder';
import toast from 'react-hot-toast';
import { ReminderCategory } from '@/types/Enums';
import usePayment from '@/pages/finance/installment/components/usePayment';
import CreateOrUpdateDialog from '@/pages/insruancePolicy/CreateOrUpdateDialog';
import TemplateEditor, { Tag, useTemplateEditor } from '@/components/common/TemplateEditor';
import SMSTemplateViewer from './SMSTemplateViewer';


interface ReminderRenewDialogProps {
  open: boolean,
  onClose: (open: boolean) => void
  category: ReminderCategoryResponse | null
}


export default function ReminderRenewDialog({ category, onClose, open }: ReminderRenewDialogProps) {



  const apiRef = useGridApiRef();
  const [loading, setLoading] = useState(false);

  const [policyId, setPolicyId] = useState<number | null>(null);
  const [openCreateOrUpdate, setOpenCreateOrUpdate] = useState(false);
  const [viewTemplate, setTemplateView] = useState(false);

  const {
    getReminderCategoryDetail,
    reminderCategoryDetail,
    detailStatus,
    getReminderCategoryList
  } = useReminderStore();



  const {
    openPaymentDialog,
    setOpenDialog,
    policy,
    openDialog,
    installmentItemId,
    groupType
  } = usePayment();

  const [finalMessage, setFinalMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    template,
    setTemplate,
    tags,
    smsInfo,
    replaceTags,
    validateTemplate
  } = useTemplateEditor();



  useEffect(() => {
    if (open) {
      getReminderCategoryDetail(ReminderCategory.Renew);
    }
  }, [open])


  const handleRejectReminderClick = async () => {

    const selectedIds = apiRef.current.getSelectedRows();
    const selectedRows = Array.from(selectedIds.values());

    if (selectedRows.length > 0) {

      const request: RejectReminderRequest = {
        category: ReminderCategory.Renew,
        entityIds: selectedRows.map(c => c.entityId)
      };

      const count = selectedRows.length;

      try {

        if (confirm(' آیا از انجام عملیات مطمئن هستید؟' + `تعداد رکورد انتخاب شده: ${count}`)) {
          setLoading(true);
          await rejectReminder(request).then(() => {
            toast.success('عملیات با موفقیت انجام شد');
            getReminderCategoryDetail(ReminderCategory.Renew);
            getReminderCategoryList();
            setLoading(false);
          });
        }
      } catch (error) { setLoading(false); }

    }


  }

  const handleSendSmsReminderClick = async () => {

    const selectedIds = apiRef.current.getSelectedRows();
    const selectedRows = Array.from(selectedIds.values());

    if (selectedRows.length > 0) {

      const request: SendReminderSmsRequest = {
        category: ReminderCategory.Renew,
        entityIds: selectedRows.map(c => c.entityId),
      };

      const count = selectedRows.length;

      try {

        if (confirm(' آیا از انجام عملیات مطمئن هستید؟' + `تعداد رکورد انتخاب شده: ${count}`)) {
          setLoading(true);
          await sendReminderSms(request).then(() => {
            toast.success('عملیات با موفقیت انجام شد');
            getReminderCategoryDetail(ReminderCategory.Renew);
            getReminderCategoryList();
            setLoading(false);
          });
        }
      } catch (error) { setLoading(false); }
    }
  }


  const handleSMSTemplateView = async (policyId: number) => {
    setPolicyId(policyId);
    setTemplateView(true);
  }

  const columns: GridColDef[] = [
    {
      width: 100,
      field: "actions",
      headerName: "عملیات",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="تمدید بیمه نامه">
              <RestartAlt color='success' />
            </Tooltip>
          }
          label="تمدید بیمه نامه"
          onClick={() => handlePolicyRenewal(params.row?.entityId)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={'نمایش متن پیامک'}>
              <RemoveRedEyeOutlined />
            </Tooltip>
          }
          label="نمایش قالب پیامک"
          onClick={() => handleSMSTemplateView(params.row?.entityId)}
        />
      ]
    },
    {
      field: 'fullName',
      headerName: 'بیمه گذار',
      width: 150,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'insuranceCategory',
      headerName: 'دسته بندی',
      width: 200,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'expireDate',
      headerName: 'تاریخ انقضاء',
      width: 150,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    // {
    //   field: 'nationalCode',
    //   headerName: 'کد ملی',
    //   width: 110,
    //   renderCell(params) {
    //     return <Tooltip title={params.value}>{params.value}</Tooltip>
    //   },
    // },
    {
      field: 'insuranceNo',
      headerName: 'شماره بیمه نامه',
      width: 160,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'marketer',
      headerName: 'بازاریاب',
      width: 180,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'introducer',
      headerName: 'معرف',
      width: 180,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'شماره تلفن',
      width: 110,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },
    {
      field: 'description',
      headerName: 'توضیحات',
      width: 300,
      renderCell(params) {
        return <Tooltip title={params.value}>{params.value}</Tooltip>
      },
    },

  ]


  const handlePolicyRenewal = (policyId: number) => {
    setPolicyId(policyId);
    setOpenCreateOrUpdate(true);
  }


  const onSaveTemplate = async () => {
    await updateTemplate({
      reminderCategory: ReminderCategory.Renew,
      template: template
    })
      .then(() => {
        toast.success('دخیره قالب صورت گرفت');
      });
  }


  return (
    <>


      {(viewTemplate && policyId) &&
        <SMSTemplateViewer
          entityId={policyId}
          open={viewTemplate}
          onClose={() => setTemplateView(false)}
          category={ReminderCategory.Renew}
        />
      }


      {/** تمدید بیمه نامه  */}
      {policyId &&
        <CreateOrUpdateDialog
          open={openCreateOrUpdate}
          onClose={() => setOpenCreateOrUpdate(false)}
          policyId={policyId}
          policyRenewal={true}
        />
      }

      <Dialog
        maxWidth='lg'
        fullWidth
        open={open}
        keepMounted
        onClose={onClose}
      >
        <DialogTitle>
          <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
            <NotificationsActive color='error' />
            <Typography
              color='error'
              fontWeight={600}
              fontSize={16} >یادآوری  {category?.reminderCategoryTitle}  (تعداد: {reminderCategoryDetail?.details?.length})</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>

          {/* 
          <TemplateEditor
            initialTemplate={reminderCategoryDetail?.template?.template}
            availableTags={reminderCategoryDetail?.template?.tags}
            onTextChange={setTemplate}
            maxLength={1000}
            onSaveTemplate={onSaveTemplate}
          /> */}

          <MyDataGrid
            apiRef={apiRef}
            loading={detailStatus === 'loading' ? true : false}
            columns={columns}
            rows={reminderCategoryDetail?.details ?? []}
            getRowId={(row) => row.entityId}
            initialPageSize={100}
            checkboxSelection
            sx={{
              '& .MuiDataGrid-row.expired-row': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                }
              },
              '& .MuiDataGrid-row.not-expired-row': {
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.2)',
                }
              },
              '& .MuiDataGrid-row.latest-expired-row': {
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 255, 0.2)',
                }
              },
              '& .MuiDataGrid-virtualScroller': { overflowX: 'auto' },
              //height: 300
            }}
            getRowClassName={(params) =>
              params.row.remindDay < 0 ? 'expired-row' : params.row.remindDay > 0 ? 'not-expired-row' : 'latest-expired-row'
            }
          />
        </DialogContent>
        <DialogActions>

          <Button
            variant='contained'
            color='success'
            onClick={handleSendSmsReminderClick}
            loading={loading}>ارسال پیامک یادآوری</Button>

          <Button
            variant='contained'
            color='warning'
            onClick={handleRejectReminderClick}
            loading={loading}>نادیده گرفتن یادآوری</Button>


          <Button
            variant='contained'
            color='primary'
            onClick={() => onClose(false)}>بستن</Button>


        </DialogActions>
      </Dialog >


    </>
  )
}
