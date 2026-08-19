import React, { useState } from 'react';
import { Box, Typography, Avatar, Paper, Tooltip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import FolderIcon from '@mui/icons-material/Folder';

interface FileDisplayProps {
    file: File | null;
}

const FileViewerBox: React.FC<FileDisplayProps> = ({ file }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // ایجاد preview برای عکس
    React.useEffect(() => {      
        if (file && isImageFile(file)) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }, [file]);

    // بررسی نوع فایل
    const getFileIcon = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (isImageFile(file)) {
            return <ImageIcon color="primary" />;
        }

        switch (extension) {
            case 'pdf':
                return <PictureAsPdfIcon color="error" />;
            case 'doc':
            case 'docx':
                return <DescriptionIcon color="info" />;
            case 'xls':
            case 'xlsx':
            case 'csv':
                return <TableChartIcon color="success" />;
            case 'mp3':
            case 'wav':
            case 'ogg':
                return <AudioFileIcon color="secondary" />;
            case 'mp4':
            case 'avi':
            case 'mov':
                return <VideoFileIcon color="warning" />;
            case 'zip':
            case 'rar':
                return <FolderIcon color="action" />;
            default:
                return <InsertDriveFileIcon color="action" />;
        }
    };

    const isImageFile = (file: File) => {
        return file.type.startsWith('image/');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!file) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderColor: 'divider',
                }}
            >
                <Typography color="text.secondary">
                    فایلی انتخاب نشده است
                </Typography>
            </Paper>
        );
    }

    return (
        <Box
        >
            {isImageFile(file) && imagePreview ? (
                // نمایش preview عکس
                <Box
                    sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={imagePreview}
                        alt={file.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            ) : (
                // نمایش آیکون برای فایل‌های غیر عکس
                <Avatar
                    sx={{
                        width: 70,
                        height: 70,
                        bgcolor: 'action.hover',
                    }}
                >
                    {getFileIcon(file)}
                </Avatar>
            )}

            {/* <Box sx={{ flex: 1 }}>
                <Tooltip title={file.name}>
                    <Typography variant="body2" noWrap>
                        {truncateText(file.name, 10)}
                    </Typography>
                </Tooltip>
                <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                </Typography>
                <Tooltip title={file.type}>
                    <Typography variant="caption" color="text.secondary">
                        نوع فایل: {truncateText(file.type, 10) || 'ناشناخته'}
                    </Typography>
                </Tooltip>
            </Box> */}
        </Box>
    );
};
export default FileViewerBox;