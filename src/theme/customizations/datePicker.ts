import { alpha, Theme } from '@mui/material/styles';
import type { PickerComponents } from '@mui/x-date-pickers/themeAugmentation';
import { pickersYearClasses, pickersMonthClasses, pickersDayClasses } from '@mui/x-date-pickers';
import { menuItemClasses } from '@mui/material/MenuItem';
import { gray, brand } from '../.././theme/themePrimitives';

/* eslint-disable import/prefer-default-export */
export const datePickersCustomizations: PickerComponents<Theme> = {
    MuiPickersPopper: {
        styleOverrides: {
            paper: ({ theme }: { theme: Theme }) => ({
                marginTop: 4,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                backgroundImage: 'none',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                [`& .${menuItemClasses.root}`]: {
                    borderRadius: 6,
                    margin: '0 6px',
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.background.default,
                    boxShadow: theme.shadows[1],
                }),
            }),
        },
    },
    MuiPickersArrowSwitcher: {
        styleOverrides: {
            spacer: { width: 26 },
            button: ({ theme }: { theme: Theme }) => ({
                backgroundColor: 'transparent',
                color: theme.palette.grey[500],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[400],
                }),
                '& svg': {
                    transform: 'scaleX(-1)',
                },
            }),
        },
    },
    MuiPickersCalendarHeader: {
        styleOverrides: {
            switchViewButton: {
                padding: 0,
                border: 'none',
            },
        },
    },
    MuiPickersMonth: {
        styleOverrides: {
            monthButton: ({ theme }: { theme: Theme }) => ({
                fontSize: theme.typography.body1.fontSize,
                color: theme.palette.text.secondary,
                padding: theme.spacing(0.5),
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
                [`&.${pickersMonthClasses.selected}`]: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: theme.typography.fontWeightMedium,
                },
                '&:focus': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px',
                    backgroundColor: 'transparent',
                    [`&.${pickersMonthClasses.selected}`]: { 
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                ...theme.applyStyles('dark', {
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    [`&.${pickersMonthClasses.selected}`]: {
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                        fontWeight: theme.typography.fontWeightMedium,
                    },
                    '&:focus': {
                        outline: `3px solid ${alpha(theme.palette.primary.light, 0.5)}`,
                        outlineOffset: '2px',
                        backgroundColor: 'transparent',
                        [`&.${pickersMonthClasses.selected}`]: { 
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                }),
            }),
        },
    },
    MuiPickersYear: {
        styleOverrides: {
            yearButton: ({ theme }: { theme: Theme }) => ({
                fontSize: theme.typography.body1.fontSize,
                color: theme.palette.text.secondary,
                padding: theme.spacing(0.5),
                borderRadius: theme.shape.borderRadius,
                height: 'fit-content',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
                [`&.${pickersYearClasses.selected}`]: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: theme.typography.fontWeightMedium,
                },
                '&:focus': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px',
                    backgroundColor: 'transparent',
                    [`&.${pickersYearClasses.selected}`]: { 
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                ...theme.applyStyles('dark', {
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    [`&.${pickersYearClasses.selected}`]: {
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                        fontWeight: theme.typography.fontWeightMedium,
                    },
                    '&:focus': {
                        outline: `3px solid ${alpha(theme.palette.primary.light, 0.5)}`,
                        outlineOffset: '2px',
                        backgroundColor: 'transparent',
                        [`&.${pickersYearClasses.selected}`]: { 
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                }),
            }),
        },
    },
    MuiPickersDay: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                fontSize: theme.typography.body1.fontSize,
                color: theme.palette.text.secondary,
                padding: theme.spacing(0.5),
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
                [`&.${pickersDayClasses.selected}`]: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: theme.typography.fontWeightMedium,
                },
                '&:focus': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px',
                    backgroundColor: 'transparent',
                    [`&.${pickersDayClasses.selected}`]: { 
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                ...theme.applyStyles('dark', {
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    [`&.${pickersDayClasses.selected}`]: {
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                        fontWeight: theme.typography.fontWeightMedium,
                    },
                    '&:focus': {
                        outline: `3px solid ${alpha(theme.palette.primary.light, 0.5)}`,
                        outlineOffset: '2px',
                        backgroundColor: 'transparent',
                        [`&.${pickersDayClasses.selected}`]: { 
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                }),
            }),
        },
    },
};