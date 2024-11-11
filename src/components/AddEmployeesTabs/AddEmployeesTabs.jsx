import React, { useEffect } from 'react';
// assets

import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography } from '@mui/material';

import { getMe } from 'src/redux/slices/signUp';

import BulkInviteEmployees from 'src/sections/overview/employee/BulkInviteCandidate';
import ManualInviteEmployees from 'src/sections/overview/employee/ManualInviteCandidate';

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// ================================|| UI TABS - SAMPLE ||================================ //

export default function AddEmployeesTabs({ handleCloseModal }) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <>
      <Tabs
        value={value}
        variant="scrollable"
        onChange={handleChange}
        sx={{
          '& a': {
            minHeight: 'auto',
            minWidth: 10,
            py: 1.5,
            px: 1,
            mr: 2.2,
            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& a.Mui-selected': {
            color: theme.palette.primary.main,
          },
          '& a > svg': {
            mb: '0px !important',
            mr: 1.1,
          },
        }}
      >
        <Tab
          icon={<Icon icon="solar:user-id-bold" style={{ fontSize: '24px' }} />}
          label="Bulk Invite"
          {...a11yProps(0)}
        />
        <Tab
          icon={<Icon icon="solar:heart-bold" style={{ fontSize: '24px' }} />}
          label="Manual Invite"
          {...a11yProps(1)}
        />
      </Tabs>
      {/* bulk invite by file upload */}
      <TabPanel value={value} index={0}>
        <BulkInviteEmployees handleCloseModal={handleCloseModal} />
      </TabPanel>
      {/* bulk invite by manual operation  */}
      <TabPanel value={value} index={1}>
        <ManualInviteEmployees handleCloseModal={handleCloseModal} />
      </TabPanel>
    </>
  );
}
