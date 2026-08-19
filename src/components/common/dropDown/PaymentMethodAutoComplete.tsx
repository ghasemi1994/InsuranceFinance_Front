import { Autocomplete, TextField } from '@mui/material';
import React from 'react'
import { DepositMethodType } from '../../../types/Wallet';

const depositMethodTypes: Record<DepositMethodType, string> = {
  [DepositMethodType.BankTransfer]: 'حواله بانكی',
  [DepositMethodType.Cash]: 'نقدی',
  [DepositMethodType.Cheque]: 'چک',
  [DepositMethodType.TransferToInsuranceCompanyAccount]: 'واریز به حساب شركت بيمه',
  [DepositMethodType.Wallet]: 'برداشت از کیف پول',
  [DepositMethodType.Agency]: 'واریز به حساب نمایندگی',  
};

// Create base options array
const baseOptions = Object.values(DepositMethodType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: depositMethodTypes[value as DepositMethodType]
  }));

interface IProps {
  value?: number | null
  onChange?: (value: number | null) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  excludeOptions?: DepositMethodType[]
}

export default function PaymentMethodAutoComplete(props: IProps) {
  const { value, onChange, excludeOptions = [], disabled, error, helperText } = props;

  // Filter options based on removeOptions
  const filteredOptions = baseOptions.filter(option =>
    !excludeOptions.includes(option.value as DepositMethodType)
  );

  // Find the current option based on the numeric value
  const currentValue = filteredOptions.find(option => option.value === value) || null;

  const handleChange = (event: any, newValue: any | null) => {
    if (onChange) {
      onChange(newValue ? newValue.value : null);
    }
  }

  return (
    <Autocomplete
      onChange={handleChange}
      value={currentValue}
      options={filteredOptions}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.value}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          error={!!error}
          helperText={helperText}
        />
      )}
      isOptionEqualToValue={(option, value) => option.value === value?.value}
    />
  );
}