import { useEffect } from "react";
import { useFormStore } from "../../../stores/formStore";
import { IFormFieldPolicyResponse } from "../../../types/Form";
import { FormControl, FormHelperText, FormLabel, Grid2, Grid2Props, Stack } from "@mui/material";
import React from "react";


// 🔹 یک هوک مشترک برای گرفتن مقدار فیلد
const useFormFieldValue = (field: IFormFieldPolicyResponse, formState?: 'create' | 'update' | 'view') => {

    const { setFormFieldValue, formFieldValues } = useFormStore();

    const found = formFieldValues.find(f => f.id === field.id);

    const defaultValue = field.defaultValue || '';

    const currentValue = found?.value || defaultValue

    useEffect(() => {
        if (!found) {
            setFormFieldValue({
                id: field.id,
                value: currentValue,
                isRequired: field.isRequired
            });
        }
    }, [field.id]);

    return { currentValue, setFormFieldValue };
};

type GridSize = Grid2Props['size'];

// 🔹 یک Wrapper مشترک برای FormControl
const FieldWrapper: React.FC<{
    title: string;
    description?: string;
    size?: GridSize;
    isRequired?: boolean
    children: React.ReactNode;
    endLabelChildren?: React.ReactNode
}> = ({ title, description, size, isRequired, children, endLabelChildren }) => (
    <Grid2 size={size} >
        <FormControl fullWidth>
            <FormLabel sx={{ color: isRequired ? 'red' : '' }}>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    {title}
                    {endLabelChildren}
                </Stack>
            </FormLabel>
            {children}
            {description && <FormHelperText>{description}</FormHelperText>}
        </FormControl>
    </Grid2>
);

export { useFormFieldValue, FieldWrapper }