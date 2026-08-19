import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation, Link } from 'react-router-dom';
import { mainListItems } from '../../config/mainMenu';
import HomeIcon from '@mui/icons-material/Home';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: theme.spacing(0, 0.5),
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

const findBreadcrumbItems = (pathname: string, menuItems: any[]) => {
    const items = [];
    let currentPath = '';

    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    items.push({
        title: 'داشبورد',
        path: '/',
        icon: <HomeIcon fontSize="small" />
    });

    let currentMenuItems = menuItems;

    for (const segment of pathSegments) {
        currentPath += `/${segment}`;
        const foundItem = currentMenuItems.find(item =>
            item.to && item.to === currentPath
        );

        if (foundItem) {
            items.push({
                title: foundItem.text,
                path: foundItem.to,
                icon: foundItem.icon
            });

            if (foundItem.children) {
                currentMenuItems = foundItem.children;
            }
        }
    }

    return items;
};

export default function NavbarBreadcrumbs() {
    const theme = useTheme();
    const location = useLocation();
    const breadcrumbItems = findBreadcrumbItems(location.pathname, mainListItems);

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                    <Link
                        key={index}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: isLast ? theme.palette.text.primary : theme.palette.primary.main,
                        }}
                    >
                        {item.icon && React.cloneElement(item.icon, {
                            sx: {
                                mr: 0.5,
                                fontSize: '1rem',
                                color: isLast ? theme.palette.text.primary : theme.palette.primary.main,
                            }
                        })}
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: isLast ? 500 : 400,
                                color: isLast ? 'text.primary' : 'primary.main',
                            }}
                        >
                            {item.title}
                        </Typography>
                    </Link>
                );
            })}
        </StyledBreadcrumbs>
    );
}