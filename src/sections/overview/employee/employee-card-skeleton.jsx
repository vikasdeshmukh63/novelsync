import { Card, Stack, Skeleton } from '@mui/material';

export const EmployeeCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" width="100%" height={218} sx={{ background: '#f3f3f3' }} />
    <Stack my={2} spacing={2} justifyContent="center" alignItems="center">
      <Skeleton width="60%" height={10} />
      <Skeleton width="40%" height={10} />
      <Skeleton width="60%" height={10} />
    </Stack>
    <Stack alignItems="center" justifyContent="center" spacing={2} mt={8}>
      <Skeleton width="80%" height={10} />
      <Stack direction="row" gap={2}>
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="circular" width={30} height={30} />
      </Stack>
    </Stack>
  </Card>
);
