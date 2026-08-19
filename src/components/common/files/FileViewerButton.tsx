import { Button, Typography } from '@mui/material';
import React from 'react'
import { convertToBinaryFile } from '../../../utils/file';


interface IProps {
    fileContent: any,
    fileContentType: string
}
export default function FileViewerButton({ fileContent, fileContentType }: IProps) {
    if (!fileContent || !fileContentType) {
        return <Button
            variant="text"
            color="primary"
        >
            بدون فایل
        </Button>
    }
    return (
        <Button
            variant="text"
            color="primary"
            onClick={() => {
                const blob = new Blob([convertToBinaryFile(fileContent)], { type: fileContentType });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                // پاکسازی حافظه بعد از استفاده
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }}
        >
            مشاهده فایل
        </Button>
    );


}
