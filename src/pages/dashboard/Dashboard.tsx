import { Box, Card, Divider, Grid2, LinearProgress, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useReportStore } from '../../stores/reportStore'
import { digitSeprator } from '../../utils/text';
import InsightsIcon from '@mui/icons-material/Insights';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import DescriptionIcon from '@mui/icons-material/Description';
import InstallmentItemChart from './InstallmentItemChart';


export default function Dashboard() {

  const { getOverviewData, overviewData, status } = useReportStore();

  useEffect(() => {
    if (status === 'idle')
      getOverviewData();
  }, []);

  return (
    <>

      <Typography
        sx={{
          mb: 3,
          color: 'text.primary',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <InsightsIcon color="primary" />
        در یک نگاه
      </Typography>

      <Box sx={{
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        mb: 4,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}>

        <Grid2 container spacing={1}>
          {/* کارت 1 - آبی */}
          <Grid2 size={{ xs: 12, sm: 6, lg: 3, xl: 2 }}>
            <Card sx={{
              
              textAlign: 'center',
              //background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
              //color: 'white',
              border: '1px dashed',
              borderRadius: 3,
              //boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
              //transition: 'transform 0.3s, box-shadow 0.3s',
              // '&:hover': {
              //   transform: 'translateY(-5px)',
              //   boxShadow: '0 8px 25px rgba(33, 150, 243, 0.25)'
              // }
            }}>
              <GroupsIcon sx={{ fontSize: 30, mb: 1, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                تعداد اشخاص
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {status === 'loading' ? '...' : digitSeprator(overviewData?.totalPersonCount ?? 0)}
              </Typography>
            </Card>
          </Grid2>

          {/* کارت 2 - سبز */}
          <Grid2 size={{ xs: 12, sm: 6, lg: 3, xl: 2 }}>
            <Card sx={{
              textAlign: 'center',
              //background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
              //color: 'white',
              border: '1px dashed',
              borderRadius: 3,
              //boxShadow: '0 4px 20px rgba(0, 176, 155, 0.15)',
              //transition: 'transform 0.3s, box-shadow 0.3s',
              // '&:hover': {
              //   transform: 'translateY(-5px)',
              //   boxShadow: '0 8px 25px rgba(0, 176, 155, 0.25)'
              // }
            }}>
              <PeopleAltIcon sx={{ fontSize: 30, mb: 1, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                تعداد مشتریان
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {status === 'loading' ? '...' : digitSeprator(overviewData?.totalCustomerCount ?? 0)}
              </Typography>
            </Card>
          </Grid2>

          {/* کارت 3 - نارنجی */}
          <Grid2 size={{ xs: 12, sm: 6, lg: 3, xl: 2 }}>
            <Card sx={{
              textAlign: 'center',
              //background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
              //color: 'white',
              borderRadius: 3,
              //boxShadow: '0 4px 20px rgba(255, 126, 95, 0.15)',
              //transition: 'transform 0.3s, box-shadow 0.3s',
              border: '1px dashed',
              // '&:hover': {
              //   transform: 'translateY(-5px)',
              //   boxShadow: '0 8px 25px rgba(255, 126, 95, 0.25)'
              // }
            }}>
              <RecordVoiceOverIcon sx={{ fontSize: 30, mb: 1, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                تعداد بازاریابان
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {status === 'loading' ? '...' : digitSeprator(overviewData?.totalMarketerCount ?? 0)}
              </Typography>
            </Card>
          </Grid2>

          {/* کارت 4 - بنفش */}
          <Grid2 size={{ xs: 12, sm: 6, lg: 3, xl: 2 }}>
            <Card sx={{
              textAlign: 'center',
              //background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
              //color: 'white',
              borderRadius: 3,
              border: '1px dashed',
              //boxShadow: '0 4px 20px rgba(106, 17, 203, 0.15)',
              //transition: 'transform 0.3s, box-shadow 0.3s',
              /*'&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(106, 17, 203, 0.25)'
              }*/
            }}>
              <DescriptionIcon sx={{ fontSize: 30, mb: 1, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                تعداد بیمه نامه
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {status === 'loading' ? '...' : digitSeprator(overviewData?.totalPolicyCount ?? 0)}
              </Typography>
            </Card>
          </Grid2>
        </Grid2>
      </Box>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, lg: 6, xl: 6, md: 4 }}>
          <InstallmentItemChart />
        </Grid2>
      </Grid2>


    </>
  )
}
