import * as React from "react";
import { Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppLoader from "../common/loader/AppLoader";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import AppTheme from "../../theme/AppTheme";
import ProtectedRoute from './../../utils/ProtectedRoute';
import FixedSpeedDial from "../common/FixedSpeedDial";
import ResponsiveDrawer from "./ResponsiveDrawer";
import { appBarHeight } from "./constants";
import MyBreadcrumb from "./MyBreadcrumb";
import { useAuthStore } from "@/stores/authStore";
import UserNeedToChangePasswordDialog from "@/pages/users/UserNeedToChangePasswordDialog";

const cacheRtl = createCache({
    key: "rtl",
    stylisPlugins: [rtlPlugin],
});

export default function Layout() {

    const { userInfo } = useAuthStore();

    return (
        <CacheProvider value={cacheRtl}>
            <AppTheme>
                <CssBaseline enableColorScheme />
                {userInfo?.needToChangePassword ?
                    <UserNeedToChangePasswordDialog open={true} />
                    :
                    <Box sx={{ display: "flex" }}>
                        <ResponsiveDrawer />
                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                overflow: "hidden",
                                p: 3,
                                mt: `${appBarHeight}px`,
                            }}
                        >

                            <Stack spacing={2} sx={{ pb: 5, mt: { xs: 0, md: 0 } }}>
                                <MyBreadcrumb />
                                <React.Suspense fallback={<AppLoader />}>
                                    <ProtectedRoute />
                                </React.Suspense>
                                <FixedSpeedDial />
                            </Stack>
                        </Box>
                    </Box>
                }
            </AppTheme>
        </CacheProvider>
    );
}