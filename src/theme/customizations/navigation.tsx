import * as React from 'react';
import { Theme, alpha, Components } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { buttonBaseClasses } from '@mui/material/ButtonBase';
import { dividerClasses } from '@mui/material/Divider';
import { menuItemClasses } from '@mui/material/MenuItem';
import { selectClasses } from '@mui/material/Select';
import { tabClasses } from '@mui/material/Tab';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import { gray, brand } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const navigationCustomizations: Components<Theme> = {
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                borderRadius: theme.shape.borderRadius,
                padding: '6px 8px',
                [`&.${menuItemClasses.focusVisible}`]: {
                    backgroundColor: 'transparent',
                },
                [`&.${menuItemClasses.selected}`]: {
                    [`&.${menuItemClasses.focusVisible}`]: {
                        backgroundColor: alpha(theme.palette.action.selected, 0.3),
                    },
                },
            }),
        },
    },
    MuiMenu: {
        styleOverrides: {
            list: {
                gap: '0px',
                [`&.${dividerClasses.root}`]: {
                    margin: '0 -8px',
                },
            },
            paper: ({ theme }: { theme: Theme }) => ({
                marginTop: '4px',
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                backgroundImage: 'none',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1], // استفاده از سایه استاندارد تم
                [`& .${buttonBaseClasses.root}`]: {
                    '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.action.selected, 0.3),
                    },
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.background.default,
                    boxShadow: theme.shadows[1],
                }),
            }),
        },
    },
    MuiSelect: {
        defaultProps: {
            IconComponent: React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
                <UnfoldMoreRoundedIcon fontSize="small" {...props} ref={ref} />
            )),
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                borderRadius: theme.shape.borderRadius,
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 'none', // حذف شadow سخت برای سادگی و هماهنگی
                '&:hover': {
                    borderColor: theme.palette.grey[400],
                    backgroundColor: theme.palette.background.paper,
                },
                [`&.${selectClasses.focused}`]: {
                    outlineOffset: 0,
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '&:before, &:after': {
                    display: 'none',
                },
                ...theme.applyStyles('dark', {
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                        borderColor: theme.palette.grey[500],
                        backgroundColor: theme.palette.background.paper,
                    },
                    [`&.${selectClasses.focused}`]: {
                        borderColor: theme.palette.primary.light,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.light, 0.3)}`,
                    },
                }),
            }),
            select: ({ theme }: { theme: Theme }) => ({
                display: 'flex',
                alignItems: 'center',
                ...theme.applyStyles('dark', {
                    display: 'flex',
                    alignItems: 'center',
                    '&:focus-visible': {
                        backgroundColor: theme.palette.action.focus,
                    },
                }),
            }),
        },
    },
    MuiLink: {
        defaultProps: {
            underline: 'none',
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                color: theme.palette.text.primary,
                fontWeight: 500,
                position: 'relative',
                textDecoration: 'none',
                width: 'fit-content',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '1px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: theme.palette.text.secondary,
                    opacity: 0.3,
                    transition: 'width 0.3s ease, opacity 0.3s ease',
                },
                '&:hover::before': {
                    width: 0,
                },
                '&:focus-visible': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '4px',
                    borderRadius: '2px',
                },
            }),
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.background.default,
            }),
        },
    },
    MuiPaginationItem: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                '&.Mui-selected': {
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.primary.main,
                },
                ...theme.applyStyles('dark', {
                    '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                }),
            }),
        },
    },
    MuiTabs: {
        styleOverrides: {
            root: { minHeight: 'fit-content' },
            indicator: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.primary.main,
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.primary.light,
                }),
            }),
        },
    },
    MuiTab: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                padding: '6px 8px',
                marginBottom: '8px',
                textTransform: 'none',
                minWidth: 'fit-content',
                minHeight: 'fit-content',
                color: theme.palette.text.secondary,
                borderRadius: theme.shape.borderRadius,
                border: '1px solid',
                borderColor: 'transparent',
                ':hover': {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.divider,
                },
                [`&.${tabClasses.selected}`]: {
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                },
                ...theme.applyStyles('dark', {
                    ':hover': {
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.action.hover,
                        borderColor: theme.palette.divider,
                    },
                    [`&.${tabClasses.selected}`]: {
                        color: theme.palette.primary.light,
                    },
                }),
            }),
        },
    },
    MuiStepConnector: {
        styleOverrides: {
            line: ({ theme }: { theme: Theme }) => ({
                borderTop: '1px solid',
                borderColor: theme.palette.divider,
                flex: 1,
                borderRadius: '99px',
            }),
        },
    },
    MuiStepIcon: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                color: 'transparent',
                border: `1px solid ${theme.palette.grey[400]}`,
                width: 12,
                height: 12,
                borderRadius: '50%',
                '& text': {
                    display: 'none',
                },
                '&.Mui-active': {
                    border: 'none',
                    color: theme.palette.primary.main,
                },
                '&.Mui-completed': {
                    border: 'none',
                    color: theme.palette.success.main,
                },
                ...theme.applyStyles('dark', {
                    border: `1px solid ${theme.palette.grey[600]}`,
                    '&.Mui-active': {
                        border: 'none',
                        color: theme.palette.primary.light,
                    },
                    '&.Mui-completed': {
                        border: 'none',
                        color: theme.palette.success.light,
                    },
                }),
                variants: [
                    {
                        props: { completed: true },
                        style: {
                            width: 12,
                            height: 12,
                        },
                    },
                ],
            }),
        },
    },
    MuiStepLabel: {
        styleOverrides: {
            label: ({ theme }: { theme: Theme }) => ({
                '&.Mui-completed': {
                    opacity: 0.6,
                    ...theme.applyStyles('dark', { opacity: 0.5 }),
                },
            }),
        },
    },
};