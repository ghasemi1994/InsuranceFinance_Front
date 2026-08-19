import { Download } from '@mui/icons-material';
import { Box, Stack, Tooltip } from '@mui/material';
import React from 'react'
import { IAttachmentResponse } from '../../types/Attachment';


interface IProps {
    attachments: IAttachmentResponse[]
}
export default function AttachmentListGridColumn({ attachments }: IProps) {
    return (

        <Stack direction="row" spacing={1}>
            {attachments?.map((item, index) => {
                const fileUrl = `data:${item.fileContentType};base64,${item.fileContent}`;
                return (
                    <Tooltip key={index} title={`دانلود فایل ${item.attachmentTypeName} ${index + 1}`}>
                        <Box
                            sx={{
                                '&:hover': {
                                    color: 'primary',
                                    cursor: 'pointer'
                                },
                            }}
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = fileUrl;
                                link.download = `${item.attachmentTypeName}.${item.fileContentType.split('/')[1]}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            <Download
                                color='primary'
                            />
                        </Box>
                    </Tooltip>
                );
            })}
        </Stack>

    )
}
