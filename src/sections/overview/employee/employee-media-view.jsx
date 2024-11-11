import { Box, Typography } from '@mui/material';

export const EmployeeMediaView = () => (
  <>
    <Box
      sx={{ width: '80%', height: 300, background: 'black', borderRadius: 2, margin: '0 auto' }}
    />
    <Box textAlign="center">
      <Typography variant="caption" color="error">
        No Media Available
      </Typography>
    </Box>
  </>
);
