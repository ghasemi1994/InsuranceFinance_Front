import MyDataGrid from '@/components/common/dataGrid/MyDataGrid';
import TemplateEditor, { useTemplateEditor } from '@/components/common/TemplateEditor';
import { getReminderCategoryList, sendReminderSms, updateTemplate } from '@/server/services/reminderService';
import { useReminderStore } from '@/stores/reminderStore';
import { ReminderCategory } from '@/types/Enums';
import { ReminderCategoryResponse, SendReminderSmsRequest } from '@/types/Reminder';
import { NotificationsActive, RemoveRedEyeOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import SMSTemplateViewer from './SMSTemplateViewer';


interface ReminderBirthdayDialogProps {
    open: boolean,
    onClose: (open: boolean) => void
    category: ReminderCategoryResponse | null
}
export default function ReminderBirthdayDialog({ open, category, onClose }: ReminderBirthdayDialogProps) {

    const apiRef = useGridApiRef();
    const [loading, setLoading] = useState(false);
    const [viewTemplate, setTemplateView] = useState(false);
    const [entityId, setEntityId] = useState<number | null>(null);

    const {
        template,
        setTemplate,
    } = useTemplateEditor();


    const {
        getReminderCategoryDetail,
        reminderCategoryDetail,
        detailStatus,
    } = useReminderStore();

    useEffect(() => {
        if (open) {
            getReminderCategoryDetail(ReminderCategory.Birthday);
        }
    }, [open])

    const handleSendSmsReminderClick = async () => {

        const selectedIds = apiRef.current.getSelectedRows();
        const selectedRows = Array.from(selectedIds.values());

        if (selectedRows.length > 0) {

            const request: SendReminderSmsRequest = {
                category: ReminderCategory.Birthday,
                entityIds: selectedRows.map(c => c.entityId)
            };

            const count = selectedRows.length;

            try {

                if (confirm(' آیا از انجام عملیات مطمئن هستید؟' + `تعداد رکورد انتخاب شده: ${count}`)) {
                    setLoading(true);
                    await sendReminderSms(request).then(() => {
                        toast.success('عملیات با موفقیت انجام شد');
                        getReminderCategoryDetail(ReminderCategory.Birthday);
                        getReminderCategoryList();
                        setLoading(false);
                    });
                }
            } catch (error) { setLoading(false); }
        }
    }


    const handleSMSTemplateView = async (id: number) => {
        setEntityId(id);
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
            width: 200,
            renderCell(params) {
                return <Tooltip title={params.value}>{params.value}</Tooltip>
            },
        },
        {
            field: 'phoneNumber',
            headerName: 'شماره تلفن',
            width: 150,
            renderCell(params) {
                return <Tooltip title={params.value}>{params.value}</Tooltip>
            },
        },
        {
            field: 'description',
            headerName: 'توضیحات',
            flex: 1.5,
            renderCell(params) {
                return <Tooltip title={params.value}>{params.value}</Tooltip>
            },
        },


    ]

    const onSaveTemplate = async () => {
        await updateTemplate({
            reminderCategory: ReminderCategory.Birthday,
            template: template
        })
            .then(() => {
                toast.success('دخیره قالب صورت گرفت');
            });
    }

    return (
        <>

            {(viewTemplate && entityId) &&
                <SMSTemplateViewer
                    entityId={entityId}
                    open={viewTemplate}
                    onClose={() => setTemplateView(false)}
                    key={entityId}
                    category={ReminderCategory.Birthday}
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

                    {/* <TemplateEditor
                        initialTemplate={reminderCategoryDetail?.template?.template ?? ""}
                        availableTags={reminderCategoryDetail?.template?.tags ?? []}
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
                                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                                }
                            },
                            '& .MuiDataGrid-row.latest-expired-row': {
                                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
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
                        color='primary'
                        onClick={() => onClose(false)}>بستن</Button>

                </DialogActions>
            </Dialog >
        </>
    )
}
