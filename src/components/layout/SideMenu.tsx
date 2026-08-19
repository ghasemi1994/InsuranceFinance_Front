import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer, { type DrawerProps } from '@mui/material/Drawer';
import {
    Box,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { appBarHeight, collapsedWidth, drawerWidth } from './constants';
import { useAuthStore } from '../../stores/authStore';
import MenuContent from './MenuContent';
import Logo from '../../assets/images/Logo.png'
import { signOut } from '@/utils/userAuthenticate';

interface StyledDrawerProps extends DrawerProps {
    open: boolean;
    onToggle: () => void;
}

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})<StyledDrawerProps>(({ theme, open }) => ({
    width: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    '& .MuiDrawer-paper': {
        width: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen
        }),
        borderRight: `1px solid ${theme.palette.divider}`, // اضافه کردن حاشیه راست
        backgroundColor: theme.palette.background.paper, // سفید در حالت روشن
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    }
}));

interface SideMenuProps {
    open: boolean;
    onToggle: () => void;
}

export default function SideMenu({ open, onToggle }: SideMenuProps) {
    const theme = useTheme();
    const { userInfo, status, getUserInfo } = useAuthStore();

    React.useEffect(() => {
        if (status === 'idle') getUserInfo();
    }, []);

    const handleLogout = () => {
        signOut();
    };

    return (
        <Drawer
            variant="permanent"
            open={open}
            onToggle={onToggle}
            sx={{ overflowX: 'hidden' }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'space-between' : 'center',
                    flexDirection: 'column',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    height: `${appBarHeight}px`,
                    overflowX: 'hidden',
                    flexShrink: 0,
                    boxShadow: `0px 1px 0px ${theme.palette.divider}`, // سایه نرم
                    backgroundColor: theme.palette.background.paper, // سفید
                }}
            >
                {open ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                        gap={2}
                        height="100%"
                    >
                        <div>
                            <img src={Logo} alt="Logo" style={{ width: '70px' }} />
                        </div>
                        <Stack alignItems="center">
                            <Typography fontSize={14} fontWeight={500} color="text.primary">
                                {userInfo?.organizationName}
                            </Typography>
                            <Typography fontSize={11} color="text.secondary">
                                مدیر عامل : {userInfo?.ceoFullName}
                            </Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <img src={Logo} alt="Logo" style={{ width: '55px' }} />
                )}
            </Box>

            {/* Menu */}
            <Box
                sx={{
                    boxShadow: `inset 0px 1px 0px ${theme.palette.divider}`, // خط جداکننده ظریف
                    flexGrow: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: theme.palette.background.paper,
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[400],
                        borderRadius: '10px',
                        '&:hover': {
                            backgroundColor: theme.palette.grey[500],
                        },
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.grey[200],
                    },
                    ...theme.applyStyles('dark', {
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.grey[600],
                            '&:hover': {
                                backgroundColor: theme.palette.grey[500],
                            },
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: theme.palette.grey[800],
                        },
                    }),
                }}
            >
                <MenuContent open={open} onToggle={onToggle} />
            </Box>

            {/* Footer */}
            <Stack
                direction="row"
                sx={{
                    p: open ? 2 : 1,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    justifyContent: open ? 'flex-start' : 'center',
                    backgroundColor: theme.palette.background.paper,
                    height: `${appBarHeight}px`,
                    flexShrink: 0,
                }}
            >
                {open && userInfo && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <Typography color="text.disabled">version 1.1.0</Typography>
                        <IconButton onClick={handleLogout} aria-label="خروج">
                            <Tooltip title="خروج">
                                <Logout color="action" />
                            </Tooltip>
                        </IconButton>
                    </Box>
                )}
            </Stack>
        </Drawer>
    );
}