import * as React from 'react';
import SignInCard from './SignInCard';
import { Box } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import AppTheme from '../../theme/AppTheme';
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import CssBaseline from "@mui/material/CssBaseline";
import pageTitle from '../../utils/page';

const cacheRtl = createCache({
  key: "rtl",
  stylisPlugins: [rtlPlugin],
});

export default function Login(props: { disableCustomTheme?: boolean }) {
  pageTitle('ورود به سيستم');
  return (
    <CacheProvider value={cacheRtl}>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: '100vh',
          backgroundImage: `url('./src/assets/images/login-bg.svg')`,
        }}>
          <SignInCard />
        </Box>
      </AppTheme>
    </CacheProvider >
  );
}
