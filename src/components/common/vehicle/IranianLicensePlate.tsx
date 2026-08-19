import { Autocomplete, Box, MenuItem, Stack, TextField } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type PlateSegment = 'one' | 'two' | 'three' | 'four';
type PlateValue = Record<PlateSegment, string>;

interface IranianLicensePlateProps {
  value?: string | null;
  onChange?: (plate: string) => void;
  disabled?: boolean;
  type?: 'car' | 'motorcycle';
  isRequired?: boolean
}

const PERSIAN_LETTERS = [
  "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ",
  "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض",
  "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل",
  "م", "ن", "و", "ه", "ی"
];

const IranianLicensePlate: React.FC<IranianLicensePlateProps> = ({
  value = '',
  onChange,
  disabled = false,
  type = 'car',
  isRequired
}) => {
  const initialValues = useMemo<PlateValue>(() => {
    const safeValue = value ?? '';
    const parts = safeValue.split('-');

    if (type === 'motorcycle') {
      return { one: '', two: '', three: parts[0] || '', four: parts[1] || '' };
    }
    return {
      one: parts[0] || '',
      two: parts[1] || '',
      three: parts[2] || '',
      four: parts[3] || '',
    };
  }, [value, type]);

  const [plate, setPlate] = useState<PlateValue>(initialValues);

  useEffect(() => {
    setPlate(initialValues);
  }, [initialValues]);

  // refs برای فوکوس بعدی
  const refs: Record<PlateSegment, React.RefObject<HTMLInputElement | null>> = {
    one: useRef(null),
    two: useRef(null),
    three: useRef(null),
    four: useRef(null),
  };

  const handleChange = useCallback(
    (segment: PlateSegment, newValue: string, maxLength: number) => {
      setPlate((prev) => {
        const updated = { ...prev, [segment]: newValue };

        // اگر پر شد → برو به بعدی
        if (newValue.length >= maxLength) {
          if (segment === 'one') refs.two.current?.focus();
          if (segment === 'two') refs.three.current?.focus();
          if (segment === 'three') refs.four.current?.focus();
        }

        if (type === 'motorcycle') {
          if (updated.three && updated.four) {
            onChange?.(`${updated.three}-${updated.four}`);
          }
        } else {
          const values = Object.values(updated);
          if (values.every((v) => v.length > 0)) {
            onChange?.(`${updated.one}-${updated.two}-${updated.three}-${updated.four}`);
          }
        }

        return updated;
      });
    },
    [onChange, type]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        direction: 'rtl',
        fontSize: '16px',
        fontWeight: 'bold',
        '& .MuiInputBase-input': {
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
        },
      }}
    >
      {type === 'car' && (
        <>
          <TextField
            inputRef={refs.one}
            sx={{ width: 50 }}
            size="small"
            value={plate.one}
            onChange={(e) =>
              handleChange('one', e.target.value.replace(/[^0-9]/g, ''), 2)
            }
            disabled={disabled}
            inputProps={{ maxLength: 2 }}
            required={isRequired}
          />

          <Autocomplete
            disableClearable
            options={PERSIAN_LETTERS}
            value={plate.two}
            onChange={(_, newValue) => handleChange('two', newValue || '', 1)}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={refs.two}
                size="small"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 1,
                  'aria-labelledby': 'plate-letter-label',
                }}
                required={isRequired}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option} dir="rtl" sx={{ justifyContent: 'flex-end' }}>
                {option}
              </MenuItem>
            )}
            sx={{ width: 80 }}
          />

        </>
      )}


      <TextField
        inputRef={refs.three}
        sx={{ width: 60 }}
        size="small"
        value={plate.three}
        onChange={(e) =>
          handleChange('three', e.target.value.replace(/[^0-9]/g, ''), 3)
        }
        disabled={disabled}
        inputProps={{ maxLength: 3 }}
        required={isRequired}
      />

      <TextField
        inputRef={refs.four}
        sx={{ width: type === 'motorcycle' ? 90 : 50 }}
        size="small"
        value={plate.four}
        onChange={(e) =>
          handleChange(
            'four',
            e.target.value.replace(/[^0-9]/g, ''),
            type === 'motorcycle' ? 5 : 2
          )
        }
        disabled={disabled}
        inputProps={{ maxLength: type === 'motorcycle' ? 5 : 2 }}
        required={isRequired}
      />

    </Box>
  );
};

export default React.memo(IranianLicensePlate);
