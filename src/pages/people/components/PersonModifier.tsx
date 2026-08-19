import React, { useEffect } from 'react'
import { IPersonResponse, PersonGroupType } from '../../../types/Person';
import IndividualPersonModifier from './IndividualPersonModifier';
import { usePeopleStore } from '../../../stores/peopleStore';
import { Alert, Box, CircularProgress } from '@mui/material';
import CorporatePersonModifier from './CorporatePersonModifier';

interface IProps {
    personId?: number | null,
    title?: string
    setPersonData?: (data: IPersonResponse | null) => void
}

export default function PersonModifier({ personId, title, setPersonData }: IProps) {

    const { getPersonById, person, personStatus } = usePeopleStore();

    useEffect(() => {
        if (personId && personId > -1) {
            getPersonById(personId);
        } else {
            setPersonData?.(null);
        }
    }, [personId])



    return (
        <>
            {personStatus === 'loading' ?
                <ContentLoader />
                :
                person.personGroupTypeId === PersonGroupType.Individual ?
                    <IndividualPersonModifier
                        personId={personId}
                        title={title}
                        setPersonData={setPersonData}
                    />
                    :
                    <CorporatePersonModifier
                        personId={personId}
                        title={title}
                        setPersonData={setPersonData}
                    />


            }
        </>
    )
}


const ContentLoader = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress
                size={60}
                thickness={4}
                color="info"
                sx={{
                    '&.MuiCircularProgress-colorSecondary': {
                        color: (theme) => theme.palette.success.main,
                    },
                }}
            />
        </Box>
    )
}