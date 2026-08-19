import React, { useEffect, useState } from 'react'
import { IAttachmentTypeRequest, IAttachmentTypeResponse } from '../../types/Attachment'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid2, Stack, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { createAttachmentType, updateAttachmentType } from '../../server/services/attachmentService'
import { useAttachmentStore } from '../../stores/attachmentStore'
import toast from 'react-hot-toast'
import FileSizeAutoComplete from './components/FileSizeAutoComplete'


interface IProps {
  open: boolean
  onClose: (open: boolean) => void,
  record?: IAttachmentTypeResponse | null
}

const initialValues = {
  allowedExtensions: [],
  applicableEntity: "",
  description: '',
  id: null,
  isActive: true,
  isRequired: false,
  maxCountPerEntity: 1,
  maxFileSize: null,
  name: '',
  validationRegex: null,
  allowedMimeTypes: [],
  isUniqueRecord: false
} as IAttachmentTypeRequest

export default function AttachmentTypeDialog({ onClose, open, record }: IProps) {

  const [loading, setLoading] = useState(false);
  const { getTypeList } = useAttachmentStore();

  const { control, handleSubmit, setValue, reset } = useForm<IAttachmentTypeRequest>({
    defaultValues: initialValues
  });

  const allowedExtensions = [
    '.png',
    '.jpeg',
    '.jpg',
    '.pdf',           // PDF Documents
    '.docx', '.doc',  // Word Documents
    '.xlsx', '.xls',  // Excel Spreadsheets
  ];
  const allowedMimeType = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword',                                                      // .doc
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
    'application/vnd.ms-excel',                                                // .xls
  ];

  const onSubmit = async (data: IAttachmentTypeRequest) => {
    try {
      setLoading(true);
      if (!record) {
        await createAttachmentType(data).then(() => {
          getTypeList();
          toast.success('attachment type added');
          reset(initialValues);
          setLoading(false);
          handleClose();
        });
      } else {
        await updateAttachmentType(data).then(() => {
          getTypeList();
          toast.success('attachment type updated');
          setLoading(false);
          handleClose();
        });
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (record && record.id) {
        setValue('id', record.id);
        setValue('name', record.name);
        setValue('description', record.description);
        setValue('maxFileSize', record.maxFileSize);
        setValue('maxCountPerEntity', record.maxCountPerEntity);
        setValue('isRequired', record.isRequired);
        setValue('isActive', record.isActive);
        setValue('allowedExtensions', record.allowedExtensions);
        setValue('allowedMimeTypes', record.allowedMimeTypes);
        setValue('applicableEntity', record.applicableEntity);
        setValue('isUniqueRecord', record.isUniqueRecord);
      }
    }
  }, [open])

  const handleClose = () => {
    onClose(false);
    reset();
  };

  return (
    <>
      <Dialog
        maxWidth='md'
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="dialog-person"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{!record ? "جدید" : "ویرایش"}</DialogTitle>
          <DialogContent sx={{ paddingBottom: 0 }}>
            <Grid2 container spacing={2}>

              <Grid2 size={3}>
                <FormControl fullWidth>
                  <FormLabel>نام</FormLabel>
                  <Controller
                    control={control}
                    name='name'
                    rules={{ required: 'field is required' }}
                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                      <TextField
                        variant='outlined'
                        onBlur={onBlur}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={3}>
                <FormControl fullWidth>
                  <FormLabel>Max FileSize</FormLabel>
                  <Controller
                    control={control}
                    name='maxFileSize'
                    rules={{ required: 'field is required' }}
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                      <FileSizeAutoComplete
                        onChange={(val) => onChange(Number(val))}
                        value={value}
                        error={!!error}
                        helperText={error?.message}
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={3}>
                <FormControl fullWidth>
                  <FormLabel>Entity Name</FormLabel>
                  <Controller
                    control={control}
                    name='applicableEntity'
                    rules={{ required: 'field is required' }}
                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                      <TextField variant='outlined'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                        dir='ltr'
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={3}>
                <FormControl fullWidth>
                  <FormLabel>Max Count Per-Entity</FormLabel>
                  <Controller
                    control={control}
                    name='maxCountPerEntity'
                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                      <NumericFormat
                        customInput={TextField}
                        variant='outlined'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                        dir='ltr'
                        allowLeadingZeros
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={6}>
                <FormControl fullWidth>
                  <FormLabel>توضیحات</FormLabel>
                  <Controller
                    control={control}
                    name='description'
                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                      <TextField variant='outlined'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={2}>
                <FormControl fullWidth>
                  <FormLabel>IsRequired</FormLabel>
                  <Controller
                    control={control}
                    name='isRequired'
                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                      <Checkbox
                        onChange={(e) => onChange(e.target.checked)}
                        value={value}

                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={2}>
                <FormControl fullWidth>
                  <FormLabel>IsActive</FormLabel>
                  <Controller
                    control={control}
                    name='isActive'
                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                      <Checkbox
                        onChange={(e) => onChange(e.target.checked)}
                        value={value}
                        checked={value}
                      />
                    }
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={2}>
                <FormControl fullWidth>
                  <FormLabel>IsUniqueRecord</FormLabel>
                  <Controller
                    control={control}
                    name='isUniqueRecord'
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color='error'
                            onChange={onChange}
                            value={value}
                            checked={value}                          
                          />                          
                        }
                        label=""
                      />
                    )}
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={12} marginTop={2}>
                {/* Allowed Extensions */}
                <FormControl fullWidth>
                  <FormLabel>Extensions</FormLabel>
                  <Controller
                    name="allowedExtensions"
                    control={control}
                    rules={{
                      required: 'filed is required', // "At least one file extension must be selected"
                      validate: (value) =>
                        (value && value.length > 0) || 'filed is required' // "Please select at least one option"
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl component="fieldset" error={!!error} fullWidth>
                        <FormGroup row>
                          {allowedExtensions.map((ext) => (
                            <FormControlLabel
                              dir='rtl'
                              key={ext}
                              control={
                                <Checkbox
                                  checked={field.value?.includes(ext) || false}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [...(field.value || []), ext]
                                      : field.value?.filter(v => v !== ext) || [];
                                    field.onChange(newValue);
                                  }}
                                />
                              }
                              label={
                                <Typography sx={{ direction: 'rtl' }}>{ext}</Typography>
                              }
                            />
                          ))}
                        </FormGroup>
                        {error && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid2>

              <Grid2 size={12} marginTop={2}>
                {/* Allowed MimeTypes */}
                <FormControl fullWidth>
                  <FormLabel>Multipurpose Internet Mail Extensions</FormLabel>
                  <Controller
                    name="allowedMimeTypes"
                    control={control}
                    rules={{
                      required: 'filed is required', // "At least one file extension must be selected"
                      validate: (value) =>
                        (value && value.length > 0) || 'filed is required' // "Please select at least one option"
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl component="fieldset" error={!!error} fullWidth>
                        <FormGroup row>
                          {allowedMimeType.map((ext) => (
                            <FormControlLabel
                              dir='rtl'
                              key={ext}
                              control={
                                <Checkbox
                                  checked={field.value?.includes(ext) || false}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [...(field.value || []), ext]
                                      : field.value?.filter(v => v !== ext) || [];
                                    field.onChange(newValue);
                                  }}
                                />
                              }
                              label={
                                <Typography sx={{ direction: 'rtl' }}>{ext}</Typography>
                              }
                            />
                          ))}
                        </FormGroup>
                        {error && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid2>

            </Grid2>

          </DialogContent>
          <DialogActions>
            <Button type='submit' color='success' variant='contained' size='small' loading={loading}>
              {record ? 'ویرایش' : 'ثبت'}
            </Button>
            <Button size='small' onClick={handleClose} disabled={loading}>بستن</Button>
          </DialogActions>
        </form>
      </Dialog >
    </>
  )
}
