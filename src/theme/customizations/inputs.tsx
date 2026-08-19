import * as React from 'react';
import { alpha, Theme, Components } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { gray, brand, green, red, orange } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
    MuiButtonBase: {
        defaultProps: {
            disableTouchRipple: true,
            disableRipple: true,
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                boxSizing: 'border-box',
                transition: 'all 100ms ease-in',
                '&:focus-visible': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px',
                },
            }),
        },
    },
    MuiButton: {
        defaultProps: {
            disableElevation: true,
            size: "small",
            variant: "contained",
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                boxShadow: 'none',
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            height: '2.25rem',
                            padding: '8px 12px',
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            height: '2.5rem',
                        },
                    },
                    {
                        props: { color: 'secondary', variant: 'contained' },
                        style: {
                            color: '#fff',
                            backgroundColor: theme.palette.secondary.main,
                            border: `1px solid ${theme.palette.secondary.dark}`,
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.dark,
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: theme.palette.secondary.dark,
                            },
                            ...theme.applyStyles('dark', {
                                color: '#fff',
                                backgroundColor: theme.palette.secondary.main,
                                border: `1px solid ${theme.palette.secondary.light}`,
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.dark,
                                },
                                '&:active': {
                                    backgroundColor: theme.palette.secondary.dark,
                                },
                            }),
                        },
                    },
                    {
                        props: { color: 'primary', variant: 'contained' },
                        style: {
                            color: '#fff',
                            backgroundColor: theme.palette.primary.main,
                            border: `1px solid ${theme.palette.primary.dark}`,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        },
                    },
                    {
                        props: { variant: 'outlined' },
                        style: {
                            color: theme.palette.text.primary,
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                borderColor: theme.palette.grey[400],
                            },
                            '&:active': {
                                backgroundColor: theme.palette.action.selected,
                            },
                            ...theme.applyStyles('dark', {
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    borderColor: theme.palette.grey[600],
                                },
                            }),
                        },
                    },
                    {
                        props: { color: 'secondary', variant: 'outlined' },
                        style: {
                            color: theme.palette.secondary.main,
                            border: `1px solid ${theme.palette.secondary.light}`,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                                borderColor: theme.palette.secondary.main,
                            },
                            '&:active': {
                                backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                            },
                            ...theme.applyStyles('dark', {
                                color: theme.palette.secondary.light,
                                borderColor: alpha(theme.palette.secondary.main, 0.3),
                                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                                    borderColor: theme.palette.secondary.light,
                                },
                            }),
                        },
                    },
                    {
                        props: { variant: 'text' },
                        style: {
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                            '&:active': {
                                backgroundColor: theme.palette.action.selected,
                            },
                            ...theme.applyStyles('dark', {
                                color: theme.palette.text.primary,
                            }),
                        },
                    },
                    {
                        props: { color: 'secondary', variant: 'text' },
                        style: {
                            color: theme.palette.secondary.main,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                            },
                            '&:active': {
                                backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                            },
                            ...theme.applyStyles('dark', {
                                color: theme.palette.secondary.light,
                            }),
                        },
                    },
                    {
                        props: { color: 'success' },
                        style: {
                            color: '#fff',
                            backgroundColor: theme.palette.success.main,
                            '&:hover': {
                                backgroundColor: theme.palette.success.dark,
                                boxShadow: 'none',
                            },
                        },
                    },
                    {
                        props: { color: 'error' },
                        style: {
                            color: '#fff',
                            backgroundColor: theme.palette.error.main,
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark,
                                boxShadow: 'none',
                            },
                        },
                    },
                    {
                        props: { color: 'warning' },
                        style: {
                            color: '#fff',
                            backgroundColor: theme.palette.warning.main,
                            '&:hover': {
                                backgroundColor: theme.palette.warning.dark,
                                boxShadow: 'none',
                            },
                        },
                    },
                    {
                        props: { color: 'info' },
                        style: {
                            color: '#fff',
                            backgroundColor: theme.palette.info.main,
                            '&:hover': {
                                backgroundColor: theme.palette.info.dark,
                                boxShadow: 'none',
                            },
                        },
                    },
                    {
                        props: { color: 'inherit' },
                        style: {
                            color: 'inherit',
                            '&:hover': {
                                boxShadow: 'none',
                            },
                        },
                    },
                ],
            }),
        },
    },
    MuiToggleButtonGroup: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[1],
                [`& .${toggleButtonGroupClasses.selected}`]: {
                    color: theme.palette.primary.main,
                },
                ...theme.applyStyles('dark', {
                    boxShadow: theme.shadows[2],
                    [`& .${toggleButtonGroupClasses.selected}`]: {
                        color: theme.palette.primary.light,
                    },
                }),
            }),
        },
    },
    MuiToggleButton: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                padding: '12px 16px',
                textTransform: 'none',
                borderRadius: theme.shape.borderRadius,
                fontWeight: 500,
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[400],
                    [`&.${toggleButtonClasses.selected}`]: {
                        color: theme.palette.primary.light,
                    },
                }),
            }),
        },
    },
    MuiCheckbox: {
        defaultProps: {
            disableRipple: true,
            icon: <CheckBoxOutlineBlankRoundedIcon sx={{ color: 'transparent' }} />,
            checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
            indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                margin: 8,
                height: 16,
                width: 16,
                borderRadius: 5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: 'border-color, background-color, 120ms ease-in',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                },
                '&.Mui-focusVisible': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px',
                    borderColor: theme.palette.primary.main,
                },
                '&.Mui-checked': {
                    color: '#fff',
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.background.default,
                    borderColor: theme.palette.divider,
                    '&:hover': {
                        borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-checked': {
                        backgroundColor: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                    },
                }),
            }),
        },
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                border: 'none',
            },
            input: {
                '&::placeholder': {
                    opacity: 0.7,
                    color: (theme: Theme) => theme.palette.text.disabled,
                },
            },
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: 0,
            },
            root: ({ theme }: { theme: Theme }) => ({
                padding: '8px 12px',
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: 'border 120ms ease-in',
                '&:hover': {
                    borderColor: theme.palette.grey[400],
                },
                [`&.${outlinedInputClasses.focused}`]: {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    borderColor: theme.palette.primary.main,
                },
                ...theme.applyStyles('dark', {
                    '&:hover': {
                        borderColor: theme.palette.grey[500],
                    },
                }),
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            height: '2.25rem',
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            height: '2.5rem',
                        },
                    },
                ],
            }),
            notchedOutline: {
                border: 'none',
            },
        },
    },
    MuiInputAdornment: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                color: theme.palette.grey[500],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[400],
                }),
            }),
        },
    },
    MuiFormLabel: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                typography: theme.typography.caption,
                marginBottom: 8,
            }),
        },
    },
    MuiAutocomplete: {
        defaultProps: {
            size: "medium",
        },
        styleOverrides: {
            inputRoot: {
                //minHeight: 56,
                alignItems: "center",
                paddingTop: "4px !important",
                paddingBottom: "4px !important",
            },
            tag: {
                margin: 2,
                alignSelf: "center",
            },
            endAdornment: {
                top: "50%",
                transform: "translateY(-50%)",
            },
        },
    },

};