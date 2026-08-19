import React, { useState } from 'react'
import { IAttachmentTypeResponse, IAttachmentUploadRequest } from '../../types/Attachment';
import FileTypeAutoComplete from './components/FileTypeAutoComplete';
import { Button, FormControl, FormLabel, Grid2, Stack, styled, Tooltip, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Delete, UploadRounded } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import { uploadAttachmentFile } from '../../server/services/attachmentService';
import AttachmentList from './AttachmentList';
import { useAttachmentStore } from '../../stores/attachmentStore';


type DocumentFile = {
    file: File | null;
    fileName?: string;
    error?: string;
};

const initialValues = {
    title: null,
    attachmentTypeId: null,
    description: null,
    entityId: null,
    file: null
} as IAttachmentUploadRequest


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const initCurrentFile = {
    file: null,
    error: '',
    fileName: ''
} as DocumentFile

interface IProps {
    entityType: string,
    entityId: number
}

export default function AttachmentUploader({ entityType, entityId }: IProps) {

    const [currentFile, setCurrentFile] = useState<DocumentFile>(initCurrentFile);
    const [currentType, setCurrentType] = useState<IAttachmentTypeResponse | null>(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const { getAttachmentList } = useAttachmentStore();

    const { control, handleSubmit, setValue, reset, getValues } = useForm<IAttachmentUploadRequest>({
        defaultValues: initialValues
    });

    const handleFileTypeChange = (fileType: IAttachmentTypeResponse | null) => {
        setValue('attachmentTypeId', fileType?.id ?? null);
        setCurrentType(fileType);
        setCurrentFile(initCurrentFile);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setValue('file', selectedFile);
        let error = '';
        let fileName = '';

        if (selectedFile) {
            // Get file extension
            fileName = selectedFile.name;
            const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
            // Validate both extension and MIME type
            const isValidExtension = currentType?.allowedExtensions.includes(fileExtension);
            const isValidMimeType = currentType?.allowedMimeTypes.includes(selectedFile.type);

            if (!isValidExtension || !isValidMimeType) {
                error = `Only (${currentType?.allowedExtensions.join(', ')}) files are allowed`;
            }
            else if (currentType?.maxFileSize && (selectedFile.size > currentType?.maxFileSize)) {
                error = `حجم فایل بیش از حد مجاز است.`;
            }
            else {
                // Create preview for images only
                // if (selectedFile.type.startsWith('image/')) {
                //     preview = URL.createObjectURL(selectedFile);
                // }
            }
        }
        setCurrentFile({
            file: selectedFile,
            error: error,
            fileName: fileName
        });

    };

    const PreviewFile = () => {
        return (
            <>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={2} border={'1px grey dashed'} padding={1} borderRadius={2}>
                    <Typography>{currentFile?.file?.name}</Typography>
                    <Tooltip title='حذف' sx={{ cursor: 'pointer' }}>
                        <Delete fontSize='small'
                            color='error'
                            onClick={() => setCurrentFile({ file: null, error: '', fileName: '' })}
                        />
                    </Tooltip>
                </Stack>
            </>
        )
    }


    const onSubmit = async (data: IAttachmentUploadRequest) => {
        if (!entityId || !entityType) {
            toast.error('invalid entity');
            return;
        }
        if (!currentFile.file) {
            toast.error('فایل انتخاب نشده است');
            return;
        }
        if (currentFile.error) {
            toast.error(currentFile.error);
            return;
        }
        const formData = new FormData();
        formData.append('title', data.title?.toString() ?? '');
        formData.append('description', data.description?.toString() ?? '')
        formData.append('entityId', entityId.toString() ?? '');
        formData.append('attachmentTypeId', data.attachmentTypeId?.toString() ?? '');
        formData.append('file', data.file ?? '');
        try {
            setLoadingUpload(true);
            await uploadAttachmentFile(formData).then((res) => {
                toast.success('فایل با موفقیت آپلود شد');
                reset();
                setCurrentFile(initCurrentFile);
                setLoadingUpload(false);
                getAttachmentList(entityType, entityId);
            });
        } catch { setLoadingUpload(false); }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Grid2 container spacing={3} mb={1}>
                    <Grid2 size={{ xl: 4, lg: 6, md: 6, sm: 6, xs: 6 }}>
                        <FormControl fullWidth>
                            <FormLabel>نوع فایل</FormLabel>
                            <Controller
                                control={control}
                                name='attachmentTypeId'
                                rules={{ required: 'field is required' }}
                                render={({ field: { value }, fieldState: { error } }) =>
                                    <FileTypeAutoComplete
                                        entityName={entityType ?? ''}
                                        onChange={(e) => handleFileTypeChange(e)}
                                        value={value}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                }
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xl: 4, lg: 6, md: 6, sm: 6, xs: 6 }}>
                        <FormControl fullWidth>
                            <FormLabel sx={{ mb: 1 }}>فایل</FormLabel>
                            {currentFile?.fileName ? (
                                <PreviewFile />
                            ) : (
                                <>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                    >
                                        انتخاب فایل
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleFileChange}
                                            accept={currentType?.allowedMimeTypes.join(',')}
                                            disabled={!getValues('attachmentTypeId')?.toString() ? true : false}
                                        />
                                    </Button>
                                    <Typography color='error' fontSize={12}>{currentFile.error}</Typography>
                                </>
                            )}
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            loading={loadingUpload}
                            endIcon={<UploadRounded />}
                            sx={{ mt: 1 }}
                        >
                            آپلود
                        </Button>
                    </Grid2>
                </Grid2>
            </form>

            <AttachmentList
                entityType={entityType}
                entityId={entityId}
            />


        </>
    )
}
