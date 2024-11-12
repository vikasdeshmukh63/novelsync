import React from 'react';
import Image from 'next/image';

import { Box, Stack, Button, Divider, Typography } from '@mui/material';

import CreateOrgName from 'src/sections/createorganization/CreateOrgName';

const page = () => (
  <Stack
    justifyContent="center"
    alignItems="center"
    gap={4}
    width="800px"
    margin="12px auto"
    p={10}
  >
    <Box>
      <Typography fontSize="24px" fontWeight={700}>
        Success! Organization has been created successfully.
      </Typography>
    </Box>
    <Box>
      <Image alt="org" src="/assets/illustrations/illustration_seo.png" width={360} height={270} />
    </Box>
    <Box p={2} textAlign="center">
      <Typography style={{ fontSize: '18px' }} mb={5}>
        Your organization <CreateOrgName />
        has been added successfully. You can modify any further details by logging into the portal
        using the primary employee email id below.
      </Typography>
      <Divider sx={{ borderBottom: '1px dotted #919EAB' }} />
    </Box>

    <Box>
      <Button variant="contained" href="/" sx={{ background: '#00B8D9' }}>
        Close Window
      </Button>
    </Box>
  </Stack>
);

export default page;
