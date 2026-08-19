import React from "react";
import {
    Box,
    CssBaseline,
    IconButton,
    useTheme,
    useMediaQuery,
    Divider,
} from "@mui/material";
import MenuCloseIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import SideMenu from "./SideMenu";
import AppBarComponent from "./AppBarComponent";
import { drawerWidth } from "./constants";
import MenuContent from "./MenuContent";
import { useLayoutStore } from "../../stores/layoutStore";
import Logo from '../../assets/images/Logo.png'

export default function ResponsiveDrawer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const { drawerOpen, setDrawerOpen } = useLayoutStore();

    const handleDrawerToggle = () => {
        if (isMobile) setMobileOpen(!mobileOpen);
        else setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBarComponent
                drawerOpen={drawerOpen}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* منوی دسکتاپ */}
            {!isMobile && (
                <SideMenu
                    open={drawerOpen}
                    onToggle={handleDrawerToggle}
                />
            )}

            {/* منوی موبایل */}
            {isMobile && (
                <MuiDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            top: 56 // ارتفاع AppBar موبایل
                        },
                        boxShadow: theme.shadows[1], // اصلاح: استفاده از theme.shadows به جای عدد 1
                    }}
                >
                    {/* داخل منوی موبایل */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2
                        }}
                    >
                        <img src={Logo} alt="Logo" style={{ width: "100px" }} />
                        <IconButton onClick={handleDrawerToggle} aria-label="بستن منو">
                            <MenuCloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <MenuContent open={true} onToggle={handleDrawerToggle} />
                </MuiDrawer>
            )}
        </Box>
    );
}