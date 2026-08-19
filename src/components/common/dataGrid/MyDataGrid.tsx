import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridFilterModel,
    GridRowClassNameParams,
    GridRowIdGetter,
    GridRowsProp,
} from '@mui/x-data-grid'
import React from 'react'
import { customFaLocaleText } from './customGridText';
import { Box, styled, SxProps, Theme } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';


interface IProps {
    columns: GridColDef[],
    rows: GridRowsProp<any>,
    checkboxSelection?: boolean,
    getRowId?: GridRowIdGetter<any>
    loading?: boolean,
    editMode?: 'row' | 'cell',
    rowHeight?: number
    filterMode?: 'client' | 'server'
    onFilterModelChange?: (filterModel: GridFilterModel) => void
    pagination?: boolean; // New prop to control pagination
    pageSizeOptions?: number[]; // Optional customization of page size options
    initialPageSize?: number; // Optional initial page size
    sx?: SxProps<Theme> | undefined,
    getRowClassName?: (params: GridRowClassNameParams<any>) => string,
    apiRef?: React.RefObject<GridApiCommunity> | undefined,
    onCellClick?: (params: GridCellParams) => void,
    getCellClassName?: (params: GridCellParams<any, any>) => string;
    disableColumnResize?: boolean
}
export default function MyDataGrid(props: IProps) {
    const { columns,
        rows,
        checkboxSelection,
        getRowId,
        loading,
        editMode,
        rowHeight,
        onFilterModelChange,
        filterMode,
        pagination = true,
        pageSizeOptions = [5, 10, 20, 50, 100],
        initialPageSize = 5,
        sx,
        getRowClassName,
        apiRef,
        onCellClick,
        getCellClassName,
        disableColumnResize = false
    } = props;

    return (

        <DataGrid
            disableColumnResize={disableColumnResize}
            getCellClassName={getCellClassName}
            onCellClick={onCellClick}
            apiRef={apiRef}
            sx={sx}
            localeText={customFaLocaleText}
            filterMode={filterMode ?? 'client'}
            onFilterModelChange={onFilterModelChange}
            rowHeight={rowHeight ?? 65}
            editMode={editMode}
            loading={loading}
            getRowId={getRowId}
            checkboxSelection={checkboxSelection}
            rows={rows}
            columns={columns}
            getRowClassName={getRowClassName}
            {...(pagination && {
                initialState: {
                    pagination: { paginationModel: { pageSize: initialPageSize } },
                },
                pageSizeOptions: pageSizeOptions,
            })}
            density="compact"
            slots={{
                noRowsOverlay:
                    CustomNoRowsOverlay
            }}
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
                footer: {
                    sx: {
                        '& .MuiTablePagination-actions': {
                            //flexDirection: 'row-reverse',
                        },
                        '& .MuiTablePagination-displayedRows': {
                            //marginRight: 'auto',
                            //flexDirection: 'row-reverse',
                            //direction: 'rtl'
                        },
                        opacity: !pagination ? 0 : 1
                    }
                }
            }}
        />
    );
}

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{ mt: 2 }}>اطلاعاتی برای نمایش وجود ندارد</Box>
        </StyledGridOverlay>
    );
}

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: '#3D4751',
        ...theme.applyStyles('light', {
            fill: '#AEB8C2',
        }),
    },
    '& .no-rows-secondary': {
        fill: '#1D2126',
        ...theme.applyStyles('light', {
            fill: '#E8EAED',
        }),
    },
}));
