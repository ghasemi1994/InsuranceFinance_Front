import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateBefore";
import Box from "@mui/material/Box";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useMemo } from "react";

import { menuIndex } from "@/breadcrumb/menu.index";
import { resolveBreadcrumb } from "@/breadcrumb/breadcrumb.helper";

import React from "react";
import BackButton from "../common/BackButton";

export default function MyBreadcrumb() {
    const location = useLocation();

    const paths = useMemo(() => {
        return resolveBreadcrumb(
            location.pathname,
            menuIndex.pathMap,
            menuIndex.idMap
        );
    }, [location.pathname]);

    return (
        <Box
            sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: "center"
            }}
        >
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
            >
                {paths.map((item, index) => {
                    const isLast = index === paths.length - 1;

                    if (isLast) {
                        return (
                            <Typography
                                key={item.id}
                                fontWeight={600}
                                color="text.primary"
                            >
                                {item.name}
                            </Typography>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            component={RouterLink}
                            to={item.path}
                            underline="hover"
                            color="inherit"
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </Breadcrumbs>

            <BackButton />
        </Box>
    );
}