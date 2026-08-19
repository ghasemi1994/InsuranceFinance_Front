import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { IPersonResponse, PersonGroupType } from '../../../types/Person';
import { usePeopleStore } from '../../../stores/peopleStore';


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    width?: string
    error?: boolean,
    helperText?: string,
    disabled?: boolean
    setText?: (text: string | null) => void
    isRequired?: boolean
}

export default function PeopleAutoComplete(props: IProps) {
    const {
        value,
        onChange,
        width,
        error,
        helperText,
        disabled,
        setText,
        isRequired
    } = props;

    const { getForDropdownList, dropdownListStatus, dropdownList } = usePeopleStore();

    useEffect(() => {
        if (value) {
            const person: IPersonResponse | null | undefined = dropdownList?.find(c => c.id === value);
            setText?.(person?.fullName ?? '')
        }
    }, [value])


    const handleChange = (event: any, newValue: IPersonResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
            setText?.(newValue ? newValue.fullName : null);
        }
    }

    useEffect(() => {
        if (dropdownListStatus === 'idle') {
            getForDropdownList();
        }
    }, [dropdownListStatus]);


    const getOptionLabel = (e: IPersonResponse) => {
        return e.fullName
            + ' '
            + (e.personGroupTypeId === PersonGroupType.Individual ? e.isForeigner ? e.foreignerCode : e.nationalCode : e.nationalId) + `(${e.personGroupTypeTitle})`
    }
    return (
        <>
            <Autocomplete
                sx={{ width: width ?? '100%' }}
                onChange={handleChange}
                value={dropdownList?.find(c => c.id === value) ?? null}
                options={dropdownList ?? []}
                getOptionLabel={(e) => getOptionLabel(e)}
                getOptionKey={(e) => e.id}
                loadingText='در حال دريافت اطلاعات ...'
                noOptionsText='اطلاعاتی یافت نشد'
                disabled={disabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        disabled={disabled}
                        label=""
                        sx={{ width: '100%' }}
                        error={error}
                        helperText={helperText}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {dropdownListStatus === 'loading' ? <CircularProgress color="inherit" size={15} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        required={isRequired}
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                loading={dropdownListStatus === 'loading' ? true : false}

            />
        </>
    )
}


