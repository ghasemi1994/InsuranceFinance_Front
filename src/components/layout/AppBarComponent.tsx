import { IconButton, Stack, Toolbar, useTheme, AppBar, useMediaQuery } from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuCloseIcon from "@mui/icons-material/Menu";
import AccountMenu from "./AccountMenu";
import { appBarHeight, collapsedWidth, drawerWidth } from "./constants";
import React from "react";

interface AppBarComponentProps {
    drawerOpen: boolean;
    handleDrawerToggle: () => void;
}

export default function AppBarComponent({ drawerOpen, handleDrawerToggle }: AppBarComponentProps) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <AppBar
            position="fixed"
            color="primary"
            sx={{
                width: !isMobile ? drawerOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${collapsedWidth}px)` : '100%',
                height: `${appBarHeight}px`,
                ml: drawerOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
                zIndex: theme.zIndex.drawer + 1,
                boxShadow: theme.shadows[1],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingRight: 5,
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                >
                    {drawerOpen ? (
                        <MenuOpenIcon sx={{ width: '32px', height: '32px' }} />
                    ) : (
                        <MenuCloseIcon />
                    )}
                </IconButton>
            </Toolbar>
            <Stack>
                <AccountMenu />
            </Stack>
        </AppBar>
    );
}