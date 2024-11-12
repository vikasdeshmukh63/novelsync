'use client';

import { useSelector } from 'react-redux';

import { Typography } from '@mui/material';

const CreateOrgName = () => {
  const { createdOrgData } = useSelector((state) => state.organization);

  return (
    <Typography variant="caption" style={{ fontSize: '24px' }} color="success.main">
      {createdOrgData?.name}
    </Typography>
  );
};

export default CreateOrgName;
