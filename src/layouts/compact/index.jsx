'use client';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { Box, Stack, Button, Container } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { Logo } from 'src/components/logo';

import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

// ----------------------------------------------------------------------

export function CompactLayout({
  sx,
  children,
  header,
  textAlign = 'center',
  justifyContent = 'center',
  maxWidth = 400,
  ...others
}) {
  const layoutQuery = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          disableElevation
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' }, ...header?.sx }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Logo -- */}
                <Logo />

                <Box>
                  {/* <Box
                    component="img"
                    src="/assets/user.svg"
                    alt="organization logo"
                    sx={{
                      width: 150,
                      borderRadius: 1,
                      height: 40,
                      objectFit: 'cover',
                      display: 'inline-flex',
                      cursor: 'pointer',
                      ...sx,
                    }}
                  /> */}
                </Box>
              </>
            ),
            rightArea: (
              // <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
              //   {/* -- Help link -- */}
              //   <Link
              //     href={paths.faqs}
              //     component={RouterLink}
              //     color="inherit"
              //     sx={{ typography: 'subtitle2' }}
              //   >
              //     Need help?
              //   </Link>
              //   {/* -- Settings button -- */}
              //   <SettingsButton />
              // </Box>

              <Stack direction="row" alignItems="center" spacing={1}>
                {/* <SettingsButton /> */}
                <Button variant="contained" component={RouterLink} href="/dashboard">
                  Dashboard
                </Button>

                <Link color="inherit" sx={{ typography: 'subtitle2' }}>
                  Need help?
                </Link>
              </Stack>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: `url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Container component="main">
        <Stack
          sx={{
            py: 12,
            m: 'auto',
            maxWidth,
            minHeight: '100vh',
            textAlign,
            justifyContent,
          }}
        >
          {children}
        </Stack>
      </Container>
    </LayoutSection>
  );
}
