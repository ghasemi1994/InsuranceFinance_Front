import React, { useEffect, useState } from 'react';
import { getAttachmentTypeByEntityList } from '../../server/services/attachmentService';
import { IAttachmentTypeResponse } from '../../types/Attachment';
import {
    Card,
    CardContent,
    Grid2,
    Typography,
    Button,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import FileViewerBox from '@/components/common/files/FileViewerBox';

interface IProps {
    entityType: string;
    setFiles?: (files: File[]) => void
    resetTrigger?: any; // 👈 پراپ جدید (می‌تونه boolean یا number یا هرچی باشه)

}

type FileSlot = File | null;

/** برای دریافت فایل های انتخاب جهت  آپلود کردن */
export default function AttachmentFileList({ entityType, setFiles, resetTrigger }: IProps) {

    const [types, setTypes] = useState<IAttachmentTypeResponse[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Record<number, FileSlot[]>>({});
    const initialState: Record<number, FileSlot[]> = {};

    useEffect(() => {
        getTypes();
    }, [entityType]);


    // 👇 این useEffect به resetTrigger گوش می‌ده
    useEffect(() => {
        if (resetTrigger !== undefined) {
            const resetState: Record<number, FileSlot[]> = {};
            types.forEach((type) => {
                resetState[type.id] = Array(type.maxCountPerEntity || 1).fill(null);
            });
            setSelectedFiles(resetState);
            updateParentFiles(resetState);
        }
    }, [resetTrigger]);


    const getTypes = async () => {
        try {
            const res = await getAttachmentTypeByEntityList(entityType);
            setTypes(res.data);
            // مقداردهی اولیه استیت
            res.data.forEach((type: IAttachmentTypeResponse) => {
                initialState[type.id] = Array(type.maxCountPerEntity || 1).fill(null);
            });
            setSelectedFiles(initialState);
        } catch (err) {
            console.error(err);
        }
    };

    const updateParentFiles = (filesState: Record<number, FileSlot[]>) => {
        if (setFiles) {
            // فیلتر کردن null ها
            const allFiles = Object.values(filesState)
                .flat()
                .filter((f): f is File => f !== null);
            setFiles(allFiles);
        }
    };

    const handleFileChange = (file: File | null, typeId: number, index: number, allowedMimeTypes: string[]) => {
        if (file && !allowedMimeTypes.includes(file.type)) {
            toast.error(`فرمت فایل انتخاب شده مجاز نیست. فرمت‌های مجاز: ${allowedMimeTypes.join(', ')}`);
            return;
        }

        setSelectedFiles((prev) => {
            const updated = { ...prev };
            updated[typeId] = [...updated[typeId]];
            updated[typeId][index] = file;
            updateParentFiles(updated);
            return updated;
        });
    };


    const handleRemoveFile = (typeId: number, index: number) => {
        handleFileChange(null, typeId, index, []);
    };

    return (
        <Grid2 container spacing={2}>
            {types.map((type) => (
                <Grid2 size={12} key={type.id}>
                    <Card variant="outlined">
                        <Typography
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                                fontSize: '16px',
                                fontWeight: 500,
                                borderRadius: '8px'
                            }}>
                            {`${type.name} (${type.description})`}
                        </Typography>
                        <CardContent>
                            <Grid2 container spacing={2}>
                                {Array.from({ length: type.maxCountPerEntity || 1 }, (_, idx) => {
                                    const file = selectedFiles[type.id]?.[idx] || null;
                                    return (
                                        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }} key={idx}>
                                            <Stack spacing={1} mt={1}>
                                                {file ? (
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        sx={{
                                                            border: '1px dashed grey',
                                                            borderRadius: 1,
                                                            padding: '4px 8px'
                                                        }}
                                                    >
                                                        {/* <Typography variant="body2" noWrap>
                                                            {file.name}
                                                        </Typography> */}
                                                        <FileViewerBox file={file}/>
                                                        <Tooltip title="حذف فایل">
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleRemoveFile(type.id, idx)}
                                                            >
                                                                <DeleteIcon fontSize="small" color='error' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                ) : (
                                                    <Button
                                                        component="label"
                                                        variant="outlined"
                                                        startIcon={<CloudUploadIcon />}
                                                        disabled={!type.isActive}
                                                    >
                                                        انتخاب فایل {idx + 1}
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept={type.allowedMimeTypes.join(',')}
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    e.target.files?.[0] || null,
                                                                    type.id,
                                                                    idx,
                                                                    type.allowedMimeTypes
                                                                )
                                                            }
                                                        />
                                                    </Button>

                                                )}
                                            </Stack>
                                        </Grid2>
                                    );
                                })}
                            </Grid2>
                        </CardContent>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );
}
