import React from 'react'
import { IPolicyInstallmentItemResponse } from '../../../../types/Insurance'
import {
    Table, TableBody,
    TableCell, TableContainer,
    TableHead, TableRow,
    Tooltip, Typography,
    Checkbox
} from '@mui/material'
import { brand } from '../../../../theme/themePrimitives'
import { digitSeprator } from '../../../../utils/text'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import TextTruncator from '../../../../components/common/TextTruncator'


interface IProps {
    items: IPolicyInstallmentItemResponse[]
    selectable?: boolean
    onSelectedItemsChange?: (selectedItems: IPolicyInstallmentItemResponse[]) => void
    resetSelection?: boolean;
}

export default function InstallmentList({ items, selectable = false, onSelectedItemsChange, resetSelection }: IProps) {
    const [selected, setSelected] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (resetSelection) {
            setSelected([]);
        }
    }, [resetSelection]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = items.filter(item => !item.isPaid).map((item) => item.id);
            setSelected(newSelected);
            if (onSelectedItemsChange) {
                onSelectedItemsChange(items.filter(item => !item.isPaid));
            }
            return;
        }
        setSelected([]);
        if (onSelectedItemsChange) {
            onSelectedItemsChange([]);
        }
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const item = items.find(i => i.id === id);
        if (item?.isPaid) return; // Prevent selection of paid items

        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);

        if (onSelectedItemsChange) {
            const selectedItems = items.filter(item => newSelected.includes(item.id));
            onSelectedItemsChange(selectedItems);
        }
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    // Count of unpaid items for select all checkbox
    const unpaidItemsCount = items.filter(item => !item.isPaid).length;

    return (
        <>
            <TableContainer sx={{ marginTop: 1, width: '100%' }}>
                <Table size='small'>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: brand[700] }}>
                            {selectable && (
                                <TableCell padding="checkbox" sx={{ color: 'white' }}>
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < unpaidItemsCount}
                                        checked={unpaidItemsCount > 0 && selected.length === unpaidItemsCount}
                                        onChange={handleSelectAll}
                                        sx={{ color: 'white' }}
                                    />
                                </TableCell>
                            )}
                            <TableCell align='center' sx={{ color: 'white' }}>تاريخ سررسيد</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>تخفیف</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>مبلغ سررسید</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>نوع سررسید</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>وضعیت پرداخت</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>تاریخ واریز</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>نوع وصول</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>روز تاخیر</TableCell>
                            <TableCell align='center' sx={{ color: 'white' }}>شماره پیگیری</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                                <TableRow
                                    key={index}
                                    hover={selectable && !row.isPaid}
                                    onClick={(event) => (selectable && !row.isPaid) && handleClick(event, row.id)}
                                    role={selectable ? "checkbox" : undefined}
                                    aria-checked={isItemSelected}
                                    selected={isItemSelected}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                                        cursor: (selectable && !row.isPaid) ? 'pointer' : 'default'
                                    }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                disabled={row.isPaid}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell align='center'>{row.dueDate}</TableCell>
                                    <TableCell align='center'>{digitSeprator(row.discountAmount) + ' '}<span style={{ fontSize: '10px', color: 'gray' }}>{'ریال'}</span></TableCell>
                                    <TableCell align='center'>{digitSeprator(row.dueAmount) + ' '}<span style={{ fontSize: '10px', color: 'gray' }}>{'ریال'}</span></TableCell>
                                    <TableCell align='center'>
                                        <Typography sx={{ color: row.dueAmount > 0 ? 'green' : 'red' }}>
                                            {row.isPrePayment ? 'پیش پرداخت' : row.dueAmount > 0 ? ' قسط ' + index : 'بستانکار'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row.isPaid ? <Tooltip title="پرداخت شده"><CheckIcon color='success' /></Tooltip>
                                            : <Tooltip title="پرداخت نشده"><CloseIcon color='error' /></Tooltip>}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row.paymentDate}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <TextTruncator
                                            text={row.depositMethodTypeTitle}
                                            maxLength={20}
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row.numberOfDayLate}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row.parentTransactionId}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}