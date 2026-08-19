import React, { useEffect } from 'react'
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { IAttachmentResponse } from '../../types/Attachment'
import FileViewerButton from '../../components/common/files/FileViewerButton'
import { useAttachmentStore } from '../../stores/attachmentStore'
import { Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteAttachment } from '../../server/services/attachmentService'
import toast from 'react-hot-toast'
import FileViewerBox from '@/components/common/files/FileViewerBox'
import { base64ToFile } from '@/utils/file'

interface IProps {
    entityType: string
    entityId: number
}
export default function AttachmentList({ entityType, entityId }: IProps) {

    const { attachmentList, getAttachmentList, status } = useAttachmentStore();

    useEffect(() => {
        if (entityId && entityType)
            getAttachmentList(entityType, entityId);
    }, [entityId, entityType])


    const columns: GridColDef<IAttachmentResponse>[] = [
        {
            field: 'attachmentTypeName',
            headerName: 'نوع فایل',
            flex: 1.5,
            filterable: false,
            sortable: false,
        },
        {
            field: 'file',
            headerName: 'فایل',
            flex: 1.5,
            filterable: false,
            sortable: false,
            renderCell: (params) =>
                <FileViewerBox
                    file={base64ToFile(params.row.fileContent, 'file', params.row.fileContentType)}
                />
        },
        {
            field: 'action',
            type: 'actions',
            getActions: (params: GridRowParams<IAttachmentResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><DeleteIcon color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => handleDeleteAttachment(params.row)}
                />,
            ],
        }
    ]
    const handleDeleteAttachment = async (row: IAttachmentResponse) => {
        try {
            if (!row)
                return;
            if (window.confirm('از حذف فایل مطمئن هستید؟') === true) {
                await deleteAttachment(row.id, row.accessKey);
                getAttachmentList(entityType, entityId);
                toast.success('فایل با موفقیت حذف شد');
            }
        } catch { }
    }
    return (
        <>
            <MyDataGrid
                columns={columns}
                rows={attachmentList ?? []}
                pagination={false}
                rowHeight={100}
                loading={status === 'loading' ? true : false}
            />

        </>
    )
}
