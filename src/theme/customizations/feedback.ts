import { Theme, alpha, Components } from '@mui/material/styles';
import { gray, orange } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
    MuiAlert: {
        styleOverrides: {
            root: ({ theme, ownerState }: { theme: Theme; ownerState: { severity?: 'error' | 'info' | 'success' | 'warning' } }) => {
                // رنگ‌های پیش‌فرض (زمانی که severity مشخص نشده)
                let bgColor = orange[100];
                let borderColor = alpha(orange[300], 0.5);
                let iconColor = orange[500];

                // تنظیم رنگ بر اساس severity
                if (ownerState.severity === 'error') {
                    bgColor = theme.palette.error.light;
                    borderColor = alpha(theme.palette.error.main, 0.5);
                    iconColor = theme.palette.error.main;
                } else if (ownerState.severity === 'info') {
                    bgColor = theme.palette.info.light;
                    borderColor = alpha(theme.palette.info.main, 0.5);
                    iconColor = theme.palette.info.main;
                } else if (ownerState.severity === 'success') {
                    bgColor = theme.palette.success.light;
                    borderColor = alpha(theme.palette.success.main, 0.5);
                    iconColor = theme.palette.success.main;
                } else if (ownerState.severity === 'warning') {
                    bgColor = theme.palette.warning.light;
                    borderColor = alpha(theme.palette.warning.main, 0.5);
                    iconColor = theme.palette.warning.main;
                }

                return {
                    borderRadius: theme.shape.borderRadius, // 12px
                    backgroundColor: bgColor,
                    color: theme.palette.text.primary,
                    border: `1px solid ${borderColor}`,
                    '& .MuiAlert-icon': {
                        color: iconColor,
                    },
                    ...theme.applyStyles('dark', {
                        backgroundColor: ownerState.severity
                            ? alpha(theme.palette[ownerState.severity].dark, 0.5)
                            : alpha(orange[900], 0.5),
                        border: `1px solid ${alpha(
                            ownerState.severity ? theme.palette[ownerState.severity].main : orange[600],
                            0.5
                        )}`,
                    }),
                };
            },
        },
    },
    MuiDialog: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                '& .MuiDialog-paper': {
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    ...theme.applyStyles('dark', {
                        backgroundColor: theme.palette.background.default,
                    }),
                },
            }),
        },
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                height: 8,
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.grey[200],
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.grey[800],
                }),
            }),
        },
    },
};