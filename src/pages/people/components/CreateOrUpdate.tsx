import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { IPersonResponse, PersonGroupType } from '../../../types/Person';
import CreateOrUpdateCorporateDialog from './CreateOrUpdateCorporate';
import CreateOrUpdateIndividual from './CreateOrUpdateIndividual';



interface IProps {
  open: boolean
  onClose: (open: boolean) => void,
  data?: IPersonResponse | null
}
export default function CreateOrUpdateDialog(props: IProps) {
  const { open, onClose, data } = props;
  const [loading, setLoading] = useState(false);

  const [personType, setPersonType] = useState<PersonGroupType>(PersonGroupType.Individual);


  useEffect(() => {
    setPersonType(data?.personGroupTypeId ?? PersonGroupType.Individual);
  }, [data])

  const handleClose = () => {
    onClose(false);
  };

  const handlePersonTypeChange = (personType: number) => {
    //updating we must not change
    if (data) {
      return;
    }
    setPersonType(personType);
  }

  return (
    <>
      <Dialog
        maxWidth='md'
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="dialog-person"
      >

        <DialogTitle>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
              {data ? 'ویرایش اطلاعات' : 'جدید'}
            </Grid2>

            {!data &&
              <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                  <RadioGroup
                    row
                    name='obligated_To_Pay_Type'
                    value={personType}
                    onChange={(e) => handlePersonTypeChange(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value={PersonGroupType.Individual}
                      control={<Radio size="small" />}
                      label="حقیقی"
                    />
                    <FormControlLabel
                      value={PersonGroupType.Corporate}
                      control={<Radio size="small" />}
                      label="حقوقی"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid2>
            }
          </Grid2>
        </DialogTitle>
        <Divider />

        <DialogContent>

          {personType === PersonGroupType.Individual
            ?
            <CreateOrUpdateIndividual
              data={data}
              onClose={handleClose}
            />
            :
            <CreateOrUpdateCorporateDialog
              data={data}
              onClose={handleClose}
            />
          }




        </DialogContent>
        <DialogActions>
          {/* <Button type='submit' color='success' variant='contained' size='small' loading={loading}>ثبت</Button> */}
          <Button size='small' onClick={handleClose} disabled={loading}>بستن</Button>
        </DialogActions>

      </Dialog>
    </>
  )
}
