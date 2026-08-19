import { alpha, Theme, Components } from '@mui/material/styles';

/* eslint-disable import/prefer-default-export */
export const surfacesCustomizations: Components<Theme> = {
    MuiAccordion: {
        defaultProps: {
            elevation: 0,
            disableGutters: true,
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                padding: 4,
                overflow: 'clip',
                backgroundColor: theme.palette.background.paper, 
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: theme.shape.borderRadius,
                ':before': {
                    backgroundColor: 'transparent',
                },
                '&:not(:last-of-type)': {
                    borderBottom: 'none',
                },
                '&:first-of-type': {
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                },
                '&:last-of-type': {
                    borderBottomLeftRadius: theme.shape.borderRadius,
                    borderBottomRightRadius: theme.shape.borderRadius,
                },
            }),
        },
    },
    MuiAccordionSummary: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                border: 'none',
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
                '&:focus-visible': {
                    backgroundColor: 'transparent',
                },
                ...theme.applyStyles('dark', {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }),
            }),
        },
    },
    MuiAccordionDetails: {
        styleOverrides: {
            root: {
                marginBottom: 20,
                border: 'none',
            },
        },
    },
    MuiPaper: {
        defaultProps: {
            elevation: 1,
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
            }),
        },
    },
    MuiCard: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                padding: 16,
                gap: 16,
                transition: 'all 100ms ease',
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.background.default,
                }),
                variants: [
                    {
                        props: { variant: 'outlined' },
                        style: {
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: 'none',
                            backgroundColor: theme.palette.background.paper,
                            ...theme.applyStyles('dark', {
                                backgroundColor: alpha(theme.palette.background.default, 0.8),
                            }),
                        },
                    },
                ],
            }),
        },
    },
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: 0,
                '&:last-child': { paddingBottom: 0 },
            },
        },
    },
    MuiCardHeader: {
        styleOverrides: {
            root: {
                padding: 0,
            },
        },
    },
    MuiCardActions: {
        styleOverrides: {
            root: {
                padding: 0,
            },
        },
    },
    MuiBackdrop: {
        styleOverrides: {
            root: {
                //backgroundColor: 'rgba(0, 0, 0, 0.4)',
                //backdropFilter: 'blur(4px)',
                //WebkitBackdropFilter: 'blur(4px)',
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.divider}`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.background.default,
                }),
            }),
        },
    },
};