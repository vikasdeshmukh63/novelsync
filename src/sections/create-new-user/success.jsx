'use client';

import React from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

import { Box, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { setRecruitersData } from 'src/redux/slices/customers';
import { useRouter } from 'next/navigation';

const CustomerSuccess = ({ setActiveStep }) => {
  const { recruiterData } = useSelector((state) => state.customers);
  const router = useRouter();

  const handleNavigate = async () => {
    router.push(paths.administration.users);
    await setActiveStep(0);
    await setRecruitersData(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 10,
        gap: 3,
      }}
    >
      <Typography variant="h4">User Created Successfully</Typography>
      <Image src="/assets/illustrations/illustration-order_complete.png" width={400} height={300} />

      <Typography variant="body1">User has been created with below email,</Typography>

      <Typography variant="body1" color="green" fontWeight={600}>
        {recruiterData.email_id}
      </Typography>

      <Typography variant="body1">
        User will recieve a Welcome email and an OTP email, OTP can be verified during login.
      </Typography>

      <Typography variant="body1">Incase any issues, contact us @ help@novelhire.com</Typography>

      <Button
        startIcon={<Icon icon="ep:arrow-left-bold" />}
        onClick={handleNavigate}
        variant="outlined"
        sx={{
          mt: 3,
          color: 'inherit',
        }}
      >
        View Users
      </Button>
    </Box>
  );
};

export default CustomerSuccess;
