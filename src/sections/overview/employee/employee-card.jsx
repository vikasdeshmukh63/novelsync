import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { _socials } from 'src/_mock';

import { LinearProgress } from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'src/hooks/use-boolean';
import { EmployeeViewDrawer } from './employee-view-drawer';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------
const renderText = (data, fallBackText) => {
  if (data !== undefined && data !== null) {
    return data;
  }
  return fallBackText ? 'Not available' : '';
};
export default function EmployeeCard({ user }) {
  const theme = useTheme();
  const router = useRouter();

  const openViewEmployee = useBoolean();

  const handleEditEmployee = () => {
    router.push('/overview/employees/account/');
  };

  const handleEmployeeDrawer = () => {
    openViewEmployee.onTrue();
  };

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Image
          src={user?.customers_extras[0]?._prof_id?.path ?? '/assets/user.svg'}
          alt="profile"
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>

      <ListItemText
        sx={{ mt: 3, mb: 1 }}
        primary={`${renderText(user?.first_name)} ${renderText(user?.middle_name)} ${renderText(
          user?.last_name
        )}`}
        secondary={renderText(user?.customers_extras[0]?._job_title_id?.name, true)}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />
      <ListItemText
        secondary={renderText(user?.email_id, true)}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />
      <Stack sx={{ p: 3 }} gap={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="12px" fontWeight={700}>
            SCORE
          </Typography>
          <Typography fontSize="14px" fontWeight={600}>
            7.1
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={71}
          color="success"
          style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
        />
      </Stack>
      <Stack mb={3} gap={1} direction="row" justifyContent="center">
        <IconButton onClick={handleEditEmployee}>
          <Icon icon="solar:settings-bold-duotone" />
        </IconButton>
        <IconButton onClick={handleEmployeeDrawer}>
          <Icon icon="carbon:view-filled" />
        </IconButton>
      </Stack>
      {openViewEmployee.value && (
        <EmployeeViewDrawer openViewEmployee={openViewEmployee} currentEmployee={user} />
      )}
    </Card>
  );
}
