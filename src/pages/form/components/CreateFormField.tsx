import React, { useState } from 'react'
import { Card, Checkbox, FormControl, FormControlLabel, FormLabel, Grid2, Stack, TextField, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import FormFieldTypeAutoComplete from '../../../components/common/dropDown/FormFieldTypeAutoComplete';
import { useFormStore } from '../../../stores/formStore';
import { FormFieldType } from '../../../types/Form';


interface Props {
    fieldIndex: number;
}
export default function CreateFormField({ fieldIndex }: Props) {

    const { formFields, updateFormField } = useFormStore();
    const field = formFields[fieldIndex] || {};
    const [showLisData, setShowListData] = useState(false);

    const handleFormFeildType = (typeId: FormFieldType | null) => {

        if (typeId === FormFieldType.List)
            setShowListData(true);

        else
            setShowListData(false);

        updateFormField(fieldIndex, { formFieldTypeId: typeId })
    }

    return (
        <>
            <Card>
                <Typography variant="subtitle1" gutterBottom>
                    فیلد شماره {fieldIndex + 1}
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={3}>
                        <FormControl fullWidth>
                            <FormLabel>نام فیلد</FormLabel>
                            <TextField
                                onChange={(e) => updateFormField(fieldIndex, { title: e.target.value })}
                                value={field?.title}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={3}>
                        <FormControl fullWidth>
                            <FormLabel>توضیحات فیلد</FormLabel>
                            <TextField
                                onChange={(e) => updateFormField(fieldIndex, { description: e.target.value })}
                                value={field?.description}
                                helperText="در زیر فیلد نمایش داده می شود"
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={3}>
                        <FormControl fullWidth>
                            <FormLabel>ترتیب نمایش</FormLabel>
                            <NumericFormat
                                customInput={TextField}
                                prefix=""
                                variant="outlined"
                                dir='ltr'
                                onChange={(e) => updateFormField(fieldIndex, { displayOrder: Number(e.target.value) })}
                                value={field?.displayOrder}
                                helperText="ترتیب نمایش در فرم، هنگام چینش فیلد ها"
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={3}>
                        <FormControl fullWidth>
                            <FormLabel>نوع فیلد</FormLabel>
                            <FormFieldTypeAutoComplete
                                onChange={(e) => handleFormFeildType(e)}
                                value={field?.formFieldTypeId}
                            />
                        </FormControl>
                    </Grid2>
                    {showLisData &&
                        <Grid2 size={9}>
                            <FormControl fullWidth>
                                <FormLabel>مقادیر فیلد لیستی</FormLabel>
                                <TextField
                                    variant='outlined'
                                    onChange={(e) => updateFormField(fieldIndex, { dataOption: e.target.value })}
                                    value={field.dataOption}
                                    helperText='مقادیر اولیه `فیلد لیستی` خود را با استفاده از `-` از هم جدا کنید'

                                />
                            </FormControl>
                        </Grid2>
                    }
                    <Grid2 size={3}>
                        <FormControl fullWidth>
                            <FormLabel>مقدار اولیه</FormLabel>
                            <TextField
                                onChange={(e) => updateFormField(fieldIndex, { defaultValue: e.target.value })}
                                value={field?.defaultValue}
                                helperText='مقدار اولیه فلید برای نمایش'
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={3}>
                        <FormControl fullWidth>
                            <FormLabel>-</FormLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e) => updateFormField(fieldIndex, { isRequired: e.target.checked })}
                                        value={field?.isRequired}
                                        defaultChecked={field?.isRequired}
                                    />
                                }
                                label="فیلد اجباری می باشد؟"
                            />
                        </FormControl>
                    </Grid2>

                </Grid2>
            </Card>

        </>
    )
}
