import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import React from 'react';

interface BackButtonProps {
    fallbackPath?: string;
    color?: 'inherit' | 'primary' | 'secondary' | 'default';
    size?: 'small' | 'medium' | 'large';
}

export default function BackButton({
    fallbackPath = '/',
    color = 'default',
    size = 'small'
}: BackButtonProps) {
    const navigate = useNavigate();
    const theme = useTheme();

    // Automatically use correct arrow based on RTL/LTR
    const BackIcon = theme.direction === 'rtl' ? ArrowForwardRounded : ArrowBackRounded;

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate(fallbackPath);
        }
    };

    return (
        <Tooltip title="بازگشت" arrow placement="right">
            <IconButton
                onClick={handleBack}
                color={color}
                size={size}
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                }}
            >
                <BackIcon />
            </IconButton>
        </Tooltip>
    );
}