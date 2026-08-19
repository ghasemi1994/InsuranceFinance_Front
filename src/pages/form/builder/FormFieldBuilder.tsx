import React, { useEffect, useState } from 'react'
import {
    Autocomplete,
    Button,
    IconButton,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import { NumericFormat } from 'react-number-format'
import IranianLicensePlate from '../../../components/common/vehicle/IranianLicensePlate'
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker'
import VehicleType, { VehicleData } from '../../../components/common/vehicle/VehicleType'
import { useFormStore } from '../../../stores/formStore'
import PeopleAutoComplete from '../../../components/common/dropDown/PeopleAutoComplete'
import { Add, Delete, Download } from '@mui/icons-material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import toast from 'react-hot-toast'
import { FormFieldType, IFieldDataOption, IFormFieldPolicyResponse } from '../../../types/Form'
import useKeyPress from '../../../hooks/useKeyPress'
import CreateOrUpdateDialog from '../../people/components/CreateOrUpdate'
import { FieldWrapper, useFormFieldValue } from './useFormFieldValue'
import MotorcycleTypeAutoComplete from '../../../components/common/dropDown/MotorcycleTypeAutoComplete'
import { base64ToFile, downloadFileFromBase64 } from '../../../utils/file'
import FileViewerBox from '../../../components/common/files/FileViewerBox'

interface IProps {
    field: IFormFieldPolicyResponse
    formState?: 'create' | 'update' | 'view'
}


/* 🟢 FormFieldBuilder اصلی */
export default function FormFieldBuilder({ field, formState }: { field: IFormFieldPolicyResponse; formState?: 'create' | 'update' | 'view' }) {
    switch (field?.formFieldTypeId) {
        case FormFieldType.Text: return <TextFormField field={field} formState={formState} />
        case FormFieldType.Number: return <NumberFormField field={field} formState={formState} />
        case FormFieldType.List: return <ListFormField field={field} formState={formState} />
        case FormFieldType.MotorcyclePlate: return <MotorcyclePlateFormField field={field} formState={formState} />
        case FormFieldType.CarPlate: return <CarPlateFormField field={field} formState={formState} />
        case FormFieldType.NationalCode: return <NationalCodeFormField field={field} formState={formState} />
        case FormFieldType.PhoneNumber: return <PhoneNumberFormField field={field} formState={formState} />
        case FormFieldType.Date: return <DateFormField field={field} formState={formState} />
        case FormFieldType.Vehicle: return <VehicleFormField field={field} formState={formState} />
        case FormFieldType.People: return <PeopleFormField field={field} formState={formState} key={'people-modal-component'} />
        case FormFieldType.File: return <FileFormField field={field} formState={formState} />
        case FormFieldType.MotorcycleType: return <MotorcycleTypeFormField field={field} formState={formState} />
        default: return null
    }
}

/* -------------------------------------------------------------------------- */
/* 🟢 فیلدهای مختلف */

// 🔹 MotorcycleType
const MotorcycleTypeFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} size={3}>
            <MotorcycleTypeAutoComplete
                value={Number(currentValue)}
                onChange={(e) => setFormFieldValue({ id: field.id, value: e?.toString() ?? null })}
                isRequired={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 Text
const TextFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <TextField
                variant="outlined"
                value={currentValue}
                onChange={(e) => setFormFieldValue({ id: field.id, value: e.target.value })}
                required={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 Number
const NumberFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <NumericFormat
                customInput={TextField}
                value={currentValue}
                onChange={(e) => setFormFieldValue({ id: field.id, value: e.target.value })}
                allowLeadingZeros
                dir="ltr"
                required={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 List
const ListFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    const options: IFieldDataOption[] = field.jsonDataOption ? JSON.parse(field.jsonDataOption) : []

    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <Autocomplete
                value={options.find(opt => opt.id.toString() === currentValue) || null}
                options={options}
                getOptionLabel={(option) => option.title}
                isOptionEqualToValue={(o, v) => o.id === v?.id}
                onChange={(_, newValue) =>
                    setFormFieldValue({ id: field.id, value: newValue?.id.toString() || '' })
                }
                renderInput={(params) => <TextField
                    {...params}
                    variant="outlined"
                    required={field.isRequired}
                />}

            />
        </FieldWrapper>
    )
}

// 🔹 MotorcyclePlate
const MotorcyclePlateFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <IranianLicensePlate
                type="motorcycle"
                value={currentValue}
                onChange={(val) => setFormFieldValue({ id: field.id, value: val })}
                isRequired={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 CarPlate
const CarPlateFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <IranianLicensePlate
                type="car"
                value={currentValue}
                onChange={(val) => setFormFieldValue({ id: field.id, value: val })}
                isRequired={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 NationalCode
const NationalCodeFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <NumericFormat
                customInput={TextField}
                value={currentValue}
                onChange={(e) => setFormFieldValue({ id: field.id, value: e.target.value })}
                dir="ltr"
                required={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 PhoneNumber
const PhoneNumberFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={2}>
            <NumericFormat
                customInput={TextField}
                value={currentValue}
                onValueChange={(v) => setFormFieldValue({ id: field.id, value: v.value })}
                dir="ltr"
                required={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 Date
const DateFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <MyDatePicker
                value={currentValue}
                onChange={(d) => setFormFieldValue({ id: field.id, value: d?.toLocaleString() ?? '' })}
                isRequired={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 Vehicle
const VehicleFormField = ({ field, formState }: IProps) => {
   
    const { setFormFieldValue, currentValue } = useFormFieldValue(field, formState)

    const parseValue = (): VehicleData => {
        const result: VehicleData = { vehicleTypeId: null, vehicleTypeUsageId: null, vehicleTypeBrandId: null, vehicleTypeTipId: null }
        const parts = (currentValue as string).split(',')
        if (parts.length >= 4) {
            return {
                vehicleTypeId: parts[0] ? parseInt(parts[0]) : null,
                vehicleTypeUsageId: parts[1] ? parseInt(parts[1]) : null,
                vehicleTypeBrandId: parts[2] ? parseInt(parts[2]) : null,
                vehicleTypeTipId: parts[3] ? parseInt(parts[3]) : null,
            }
        }
        return result
    }
   
    const handleChange = (val: VehicleData) => {
        const value = [val.vehicleTypeId, val.vehicleTypeUsageId, val.vehicleTypeBrandId, val.vehicleTypeTipId].join(',')
        setFormFieldValue({ id: field.id, value })
    }

    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={12}>
            <VehicleType
                value={parseValue()}
                onChange={handleChange}
                isRequired={field.isRequired}
            />
        </FieldWrapper>
    )
}

// 🔹 People
const PeopleFormField = ({ field, formState }: IProps) => {
    const { currentValue, setFormFieldValue } = useFormFieldValue(field, formState)
    const [open, setOpen] = useState(false)
    useKeyPress('F2', () => setOpen(true))

    return (
        <>
            <CreateOrUpdateDialog
                open={open}
                onClose={() => setOpen(false)}
            />
            <FieldWrapper
                title={field.title}
                description={field.description}
                isRequired={field.isRequired}
                size={3}
                endLabelChildren={
                    <Tooltip title=" (F2) اضافه کردن شخص جدید"
                        sx={{
                            cursor: 'pointer'
                        }}>
                        <Add fontSize='small' onClick={() => setOpen(true)} />
                    </Tooltip>
                }
            >
                <PeopleAutoComplete
                    value={Number(currentValue)}
                    onChange={(val) => setFormFieldValue({ id: field.id, value: val?.toString() ?? '' })}
                    isRequired={field.isRequired}
                />
            </FieldWrapper>
        </>
    )
}

// 🔹 File
const FileFormField = ({ field, formState }: IProps) => {
    const { setFormFieldValue, formFieldValues } = useFormStore()
    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [fileSizeError, setFileSizeError] = useState(false)
    const showFileDownloadButton = formState === 'view' || formState === 'update'

    useEffect(() => {
        // 1) اول از استور چک کن
        const storedValue = formFieldValues.find(f => f.id === field.id)

        if (storedValue) {
            setCurrentFile(storedValue.file ?? null) // حتی اگه null باشه، درست sync میشه
            return
        }

        // 2) اگر استور چیزی نداشت ولی فایل از سرور هست
        if (showFileDownloadButton && field?.file?.content) {
            const file = base64ToFile(
                field.file.content,
                field.file.name || 'file',
                field.file.contentType || 'application/octet-stream'
            )
            setCurrentFile(file)
            setFormFieldValue({ id: field.id, file, value: null })
        }
    }, [field.id])

    const handleDownload = () => {
        if (!field.file?.content) return toast.error('فایل وجود ندارد')
        downloadFileFromBase64(field.file.content, field.file.contentType, field.file.name || 'file')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file && file.size > 12582912) {
            setFileSizeError(true)
            setCurrentFile(null)
            return
        }
        setFileSizeError(false)
        setCurrentFile(file)
        setFormFieldValue({ id: field.id, file, value: null })
    }

    const handleRemove = () => {
        setFormFieldValue({ id: field.id, file: null, value: null });
        setCurrentFile(null);

    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
        opacity: 0,
        cursor: 'pointer',
    })
    return (
        <FieldWrapper title={field.title} description={field.description} isRequired={field.isRequired} size={3}>
            <Stack direction="row" spacing={2} alignItems="center" width={'100%'}>
                {currentFile ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        border="1px dashed grey"
                        p={1}
                        borderRadius={2}>
                        <Stack spacing={4} bgcolor={'white'} p={1} borderRadius={1}>
                            <Tooltip title="حذف">
                                <Delete color="error"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={handleRemove}
                                />
                            </Tooltip>
                            <Tooltip title="دانلود">
                                <Download color="primary"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={handleDownload}
                                />
                            </Tooltip>
                        </Stack>

                        <FileViewerBox file={currentFile} />

                    </Stack>
                ) : (
                    <div>
                        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                            انتخاب فایل
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                                required={field.isRequired}
                                aria-required
                            />
                        </Button>
                        {fileSizeError && <Typography color="error" fontSize={12}>حداکثر حجم فایل 12MB است</Typography>}
                    </div>
                )}
            </Stack>
        </FieldWrapper>
    )
}

