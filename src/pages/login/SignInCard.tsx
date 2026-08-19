import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Controller, useForm } from 'react-hook-form';
import { signIn } from '../../utils/userAuthenticate';
import { CircularProgress, Divider, InputAdornment, Link, Stack } from '@mui/material';
import { LockOutlined, LoginRounded, PersonAddAlt1, PersonOutline } from '@mui/icons-material';
import { getToken } from '../../server/services/authenticateService';
import { ILoginRequest } from '../../types/User';

export default function SignInCard() {

  const [loading, setLoading] = React.useState<boolean>(false);

  const { control, handleSubmit } = useForm<ILoginRequest>({
    defaultValues: {
      password: '',
      userName: ''
    }
  });


  const onSubmit = async (data: ILoginRequest) => {
    try {
      setLoading(true);
      await getToken(data).then((response => {
        signIn({ token: response.data, fullName: "" });
        setLoading(false);
      }));
    } catch { setLoading(false); }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            /*transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)'
            },*/
          }}
        >
          <Box
            sx={{
              color: 'black',
              textAlign: 'center',
              marginBottom: 1
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              ورود به سیستم حسابداری مانا
            </Typography>
            <Typography variant="body2" mt={1}>
              لطفا اطلاعات کاربری خود را وارد نمایید
            </Typography>
          </Box>

          <Box p={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Controller
                  control={control}
                  name="userName"
                  rules={{ required: 'نام کاربری الزامی است' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="نام کاربری"
                      variant="outlined"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                      dir='ltr'
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: 'کلمه عبور الزامی است' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="کلمه عبور"
                      type="password"
                      variant="outlined"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                      dir='ltr'
                    />
                  )}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        sx={{
                          color: '#3f51b5',
                          '&.Mui-checked': {
                            color: '#3f51b5',
                          },
                        }}
                      />
                    }
                    label="مرا به خاطر بسپار"
                    sx={{ color: 'text.secondary' }}
                  />

                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: '#3f51b5',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: '#303f9f'
                      }
                    }}
                  >
                    رمز عبور را فراموش کرده‌اید؟
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  endIcon={!loading && <LoginRounded />}
                  sx={{
                    background: 'linear-gradient(45deg, #3f51b5 0%, #2196f3 100%)',
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                      background: 'linear-gradient(45deg, #303f9f 0%, #1976d2 100%)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'ورود به سیستم'
                  )}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>یا</Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" mb={2}>
                حساب کاربری ندارید؟
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<PersonAddAlt1 />}
                sx={{
                  borderRadius: 2,
                  borderColor: '#3f51b5',
                  color: '#3f51b5',
                  '&:hover': {
                    borderColor: '#303f9f',
                    backgroundColor: 'rgba(63, 81, 181, 0.04)'
                  }
                }}
              >
                ثبت نام
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
      {/* <Box>
        <Card variant="outlined" sx={{ width: '100%', maxWidth: '380px' }}>
          <Stack mb={4}>
            <Typography
              component={Divider}
              variant="h5"
              sx={{ width: '100%', textAlign: 'center', }}
            >
              ورود به سيستم حسابداری مانا
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, }}>

              <Grid2 container spacing={2}>
                <Grid2 size={12}>
                  <FormControl dir="ltr" fullWidth>
                    <Controller
                      control={control}
                      name='userName'
                      rules={{ required: true }}
                      render={({ field }) => <TextField
                        {...field}
                        type='text'
                        placeholder='username'
                        sx={{ height: 'calc(3.5rem + 2px)' }}
                      />
                      }
                    />
                  </FormControl>
                </Grid2>
                <Grid2 size={12}>
                  <FormControl dir="ltr" fullWidth>
                    <Controller
                      control={control}
                      name='password'
                      rules={{ required: true }}
                      render={({ field }) => <TextField
                        {...field}
                        type='password'
                        placeholder='password'
                        sx={{ height: 'calc(3.5rem + 2px)' }}
                      />
                      }
                    />
                  </FormControl>
                </Grid2>
              </Grid2>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="مرا به خاطر بسپار"
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                loading={loading}
                color='primary'
                endIcon={<LoginRounded />}
              >
                ورود
              </Button>
            </Box>
          </form>
        </Card >
      </Box> */}
    </>
  );
}
