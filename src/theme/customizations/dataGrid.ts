import { paperClasses } from '@mui/material/Paper';
import { alpha, Theme } from '@mui/material/styles';
import type { DataGridComponents } from '@mui/x-data-grid/themeAugmentation';
import { menuItemClasses } from '@mui/material/MenuItem';
import { listItemIconClasses } from '@mui/material/ListItemIcon';
import { iconButtonClasses } from '@mui/material/IconButton';
import { checkboxClasses } from '@mui/material/Checkbox';
import { listClasses } from '@mui/material/List';
import { gridClasses } from '@mui/x-data-grid';
import { tablePaginationClasses } from '@mui/material/TablePagination';

export const dataGridCustomizations: DataGridComponents<Theme> = {
    MuiDataGrid: {
        styleOverrides: {
            // ==================== ROOT ====================
            root: ({ theme }) => {
                const palette = theme.palette;
                const isDark = theme.palette.mode === 'dark';

                return {
                    '--DataGrid-overlayHeight': '300px',
                    overflow: 'clip',
                    borderColor: palette.divider,
                    backgroundColor: palette.background.paper,
                    borderRadius: '20px',
                    boxShadow: isDark 
                        ? '0 4px 20px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03)',
                    transition: 'box-shadow 0.2s ease',

                    '&:hover': {
                        boxShadow: isDark
                            ? '0 8px 30px rgba(0, 0, 0, 0.3)'
                            : '0 8px 30px rgba(0, 0, 0, 0.05)',
                    },

                    // Header استایل - درست برای دارک و لایت
                    [`& .${gridClasses.columnHeader}`]: {
                        backgroundColor: isDark ? palette.grey?.[900] : palette.grey?.[50],
                        borderBottom: `2px solid ${palette.primary.main}`,
                        borderRight: `1px solid ${palette.divider}`,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.3px',
                        color: palette.text.primary,
                        transition: 'background-color 0.2s ease',

                        '&:hover': {
                            backgroundColor: alpha(palette.primary.main, isDark ? 0.2 : 0.04),
                        },

                        '&:last-of-type': {
                            borderRight: 'none',
                        },

                        '& .MuiDataGrid-iconButtonContainer': {
                            '& .MuiSvgIcon-root': {
                                color: palette.primary.main,
                                opacity: 0.7,
                            },
                        },
                    },

                    // جداکننده ستون‌ها
                    [`& .${gridClasses.columnSeparator}`]: {
                        cursor: 'col-resize',
                        width: 4,
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s ease',
                        position: 'relative',

                        '&:hover': {
                            backgroundColor: palette.primary.main,
                            width: 4,
                            boxShadow: `0 0 8px ${alpha(palette.primary.main, 0.5)}`,
                        },

                        '&.Mui-active': {
                            backgroundColor: palette.primary.dark,
                            width: 4,
                            boxShadow: `0 0 12px ${alpha(palette.primary.dark, 0.6)}`,
                        },

                        '& .MuiSvgIcon-root': {
                            display: 'none',
                        },
                    },

                    [`& .${gridClasses.columnHeaderDraggableContainer}`]: {
                        cursor: 'grab',
                        '&:active': {
                            cursor: 'grabbing',
                        },
                    },

                    [`& .${gridClasses.columnHeaderTitleContainer}`]: {
                        flexGrow: 1,
                        justifyContent: 'space-between',
                    },

                    // ==================== فوتر - درست برای دارک مود ====================
                    [`& .${gridClasses.footerContainer}`]: {
                        backgroundColor: isDark ? palette.grey?.[900] : palette.grey?.[50],
                        borderTop: `1px solid ${palette.divider}`,
                        borderBottomLeftRadius: '20px',
                        borderBottomRightRadius: '20px',
                    },

                    // چک‌باکس
                    [`& .${checkboxClasses.root}`]: {
                        padding: theme.spacing(0.5),
                        color: isDark ? palette.grey?.[500] : palette.grey?.[400],
                        transition: 'all 0.2s ease',

                        '&.Mui-checked': {
                            color: palette.primary.main,
                        },

                        '&:hover': {
                            backgroundColor: alpha(palette.primary.main, isDark ? 0.2 : 0.08),
                        },

                        '& > svg': {
                            fontSize: '1.1rem',
                        },
                    },

                    // پیجینیشن
                    [`& .${tablePaginationClasses.root}`]: {
                        marginRight: theme.spacing(1),

                        '& .MuiIconButton-root': {
                            maxHeight: 32,
                            maxWidth: 32,
                            margin: theme.spacing(0, 0.5),
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            color: palette.text.secondary,

                            '&:hover': {
                                backgroundColor: alpha(palette.primary.main, isDark ? 0.2 : 0.1),
                                color: palette.primary.main,
                            },

                            '& > svg': {
                                fontSize: '1.2rem',
                            },
                        },

                        '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            fontWeight: 500,
                            color: palette.text.secondary,
                        },
                        
                        '& .MuiSelect-select': {
                            color: palette.text.primary,
                        },
                    },

                    // اسکرول‌بار
                    '& ::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                    },
                    '& ::-webkit-scrollbar-track': {
                        backgroundColor: isDark ? palette.grey?.[800] : palette.grey?.[100],
                        borderRadius: 10,
                    },
                    '& ::-webkit-scrollbar-thumb': {
                        backgroundColor: isDark ? palette.grey?.[600] : palette.grey?.[300],
                        borderRadius: 10,
                        transition: 'background-color 0.2s ease',

                        '&:hover': {
                            backgroundColor: palette.primary.light,
                        },
                    },
                };
            },

            // ==================== CELL ====================
            cell: ({ theme }) => {
                const palette = theme.palette;
                const isDark = theme.palette.mode === 'dark';

                return {
                    borderTopColor: palette.divider,
                    fontSize: '0.875rem',
                    transition: 'background-color 0.15s ease',
                    color: palette.text.primary,

                    '&:focus': {
                        outline: `1px solid ${palette.primary.main}`,
                        outlineOffset: -1,
                        backgroundColor: alpha(palette.primary.main, isDark ? 0.1 : 0.02),
                    },

                    '&:focus-within': {
                        outline: `1px solid ${palette.primary.main}`,
                        outlineOffset: -1,
                    },
                };
            },

            // ==================== ROW ====================
            row: ({ theme }) => {
                const palette = theme.palette;
                const isDark = theme.palette.mode === 'dark';

                return {
                   
                    
                    '&:last-of-type': {
                        borderBottom: `1px solid ${palette.divider}`,
                    },
                    
                    '&:hover': {
                        backgroundColor: isDark 
                            ? alpha(palette.primary.main, 0.15)
                            : palette.action.hover,
                    },
                    
                    '&.Mui-selected': {
                        backgroundColor: isDark
                            ? alpha(palette.primary.main, 0.25)
                            : palette.action.selected,
                            
                        '&:hover': {
                            backgroundColor: isDark
                                ? alpha(palette.primary.main, 0.35)
                                : palette.action.hover,
                        },
                    },
                    
                    '&.Mui-even': {
                        backgroundColor: isDark
                            ? alpha(palette.action.hover, 0.08)
                            : alpha(palette.action.hover, 0.04),
                    },
                };
            },

            // ==================== MENU ====================
            menu: ({ theme }) => {
                const palette = theme.palette;
                const isDark = theme.palette.mode === 'dark';

                return {
                    borderRadius: theme.shape.borderRadius,
                    backgroundImage: 'none',
                    
                    [`& .${paperClasses.root}`]: {
                        border: `1px solid ${palette.divider}`,
                        boxShadow: isDark ? theme.shadows[8] : theme.shadows[2],
                        backgroundColor: palette.background.paper,
                    },
                    
                    [`& .${menuItemClasses.root}`]: {
                        margin: '0 4px',
                        borderRadius: theme.shape.borderRadius,
                        color: palette.text.primary,
                        
                        '&:hover': {
                            backgroundColor: alpha(palette.primary.main, isDark ? 0.2 : 0.08),
                        },
                    },
                    
                    [`& .${listItemIconClasses.root}`]: {
                        marginRight: 0,
                        minWidth: 32,
                        color: palette.primary.main,
                    },
                    
                    [`& .${listClasses.root}`]: {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                };
            },

            // ==================== دکمه‌های آیکون ====================
          iconButtonContainer: ({ theme }) => {
                const palette = theme.palette;

                return {
                    [`& .${iconButtonClasses.root}`]: {
                        border: 'none',
                        backgroundColor: 'transparent',
                        padding: theme.spacing(0.75),
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',

                        '&:hover': {
                            backgroundColor: alpha(palette.primary.main, 0.1),
                            color: palette.primary.main,
                            transform: 'scale(1.05)',
                        },

                        '&:active': {
                            transform: 'scale(0.95)',
                        },

                        ...theme.applyStyles('dark', {
                            color: palette.text.primary,
                            '&:hover': {
                                backgroundColor: alpha(palette.primary.main, 0.2),
                            },
                        }),
                    },
                };
            },

            // ==================== دکمه منو ====================
            menuIconButton: ({ theme }) => {
                const palette = theme.palette;

                return {
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: theme.spacing(0.75),
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',

                    '&:hover': {
                        backgroundColor: alpha(palette.primary.main, 0.1),
                        color: palette.primary.main,
                        transform: 'rotate(90deg)',
                    },

                    ...theme.applyStyles('dark', {
                        color: palette.text.primary,
                        '&:hover': {
                            backgroundColor: alpha(palette.primary.main, 0.2),
                        },
                    }),
                };
            },
            // ==================== فرم فیلتر ====================
            filterForm: ({ theme }) => {
                const isDark = theme.palette.mode === 'dark';
                
                return {
                    gap: theme.spacing(1.5),
                    alignItems: 'flex-end',
                    padding: theme.spacing(2),
                    backgroundColor: isDark 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.02),
                    borderRadius: '12px',
                    margin: theme.spacing(1),
                };
            },

            // ==================== هدر مدیریت ستون‌ها ====================
            columnsManagementHeader: ({ theme }) => {
                const isDark = theme.palette.mode === 'dark';
                
                return {
                    padding: theme.spacing(1.5, 3),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: theme.palette.primary.main,
                    backgroundColor: isDark 
                        ? alpha(theme.palette.primary.main, 0.15)
                        : alpha(theme.palette.primary.main, 0.04),
                };
            },

            // ==================== تولبار ====================
            toolbarContainer: ({ theme }) => {
                const isDark = theme.palette.mode === 'dark';
                
                return {
                    padding: theme.spacing(1.5),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: isDark 
                        ? alpha(theme.palette.primary.main, 0.08)
                        : alpha(theme.palette.primary.main, 0.02),
                };
            },

            // ==================== اورلری (حالت لودینگ) ====================
            overlay: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.background.default, 0.8),
                backdropFilter: 'blur(8px)',
            }),

            // ==================== مجازی‌سازی اسکرول ====================
            virtualScroller: ({ theme }) => {
                const isDark = theme.palette.mode === 'dark';
                
                return {
                    '& .MuiDataGrid-virtualScrollerRenderZone': {
                        '& .MuiDataGrid-row': {
                            '&:hover': {
                                backgroundColor: isDark 
                                    ? alpha(theme.palette.primary.main, 0.15)
                                    : alpha(theme.palette.primary.main, 0.06),
                            },
                        },
                    },
                };
            },
        },
    },
    
};