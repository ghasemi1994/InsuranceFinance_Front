import { Alert, AlertTitle, Box, Divider, Grid2, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormFieldType, IFormPolicyResponse } from '../../../types/Form';
import FormFieldBuilder from './FormFieldBuilder';


interface IProps {
    form: IFormPolicyResponse | null,
    formState?: 'create' | 'update' | 'view'
}
export default function FormBuilder({ form, formState }: IProps) {

    const [currentForm, setCurrentForm] = useState<IFormPolicyResponse | null>(null);

    useEffect(() => {
        setCurrentForm(form);
    }, [form]);

    return (
        <>
            {currentForm?.fields ?
                <>
                    <Grid2 container spacing={2}
                        sx={{
                            bgcolor: '#ffefc6',
                            padding: 2,
                            borderRadius: 2,
                            mb: 1
                        }}>
                        {currentForm?.fields?.filter(c => c.formFieldTypeId !== FormFieldType.File)?.map((item) => (
                            <FormFieldBuilder
                                field={item}
                                key={item.id}
                                formState={formState}
                            />
                        ))}
                    </Grid2>

                    {currentForm?.fields?.filter(c => c.formFieldTypeId === FormFieldType.File).length > 0 &&
                        <Box sx={{
                            bgcolor: '#ffefc6',
                            padding: 2,
                            borderRadius: 2,
                        }}>
                            <Stack flexDirection={'row'} gap={2} flexWrap={'wrap'}>
                                {currentForm?.fields?.filter(c => c.formFieldTypeId === FormFieldType.File)?.map((item) => (
                                    <FormFieldBuilder
                                        field={item}
                                        key={item.id}
                                        formState={formState}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    }
                </>
                :
                <Alert>
                    فرمی برای ورود اطلاعات وجود ندارد.
                </Alert>
            }

        </>
    )
}
