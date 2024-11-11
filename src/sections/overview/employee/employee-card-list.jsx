import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import EmptyContent from 'src/components/empty-content/empty-content';

import EmployeeCard from './employee-card';
import { EmployeeCardSkeleton } from './employee-card-skeleton';

// ----------------------------------------------------------------------

export default function EmployeeCardList() {
  const { customers, isLoading } = useSelector((state) => state.customers);

  if (!isLoading && customers.length === 0) {
    return <EmptyContent filled title="No Employees Found" sx={{ p: 3 }} />;
  }

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {isLoading && customers.length === 0
        ? [...Array(10)].map((_, index) => <EmployeeCardSkeleton />)
        : customers.map((user) => <EmployeeCard key={user.id} user={user} />)}
    </Box>
  );
}
