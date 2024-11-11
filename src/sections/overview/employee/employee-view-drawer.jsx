import {
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { EmployeeDetailsView } from './employee-details-view';
import { EmployeeEvaluationView } from './employee-evaluation-view';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}> {children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export const EmployeeViewDrawer = ({ openViewEmployee, currentEmployee }) => {
  // states
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState(0);
  const theme = useTheme();

  // function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // function to handle accordion change
  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
    if (isExpanded) {
      console.log('index', index);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={openViewEmployee.value}
      onClose={openViewEmployee.onFalse}
      slotProps={{
        backdrop: { invisible: true },
      }}
    >
      <Box width="700px" p={2}>
        <Box pb={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Employee View</Typography>
          <Box>
            <IconButton onClick={openViewEmployee.onFalse}>
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
        </Box>

        <Divider />

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
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Evaluation" {...a11yProps(1)} />
        </Tabs>
        <Divider />
        {/* employee details  */}
        <TabPanel value={value} index={0}>
          <EmployeeDetailsView currentEmployee={currentEmployee} />
        </TabPanel>
        {/* employee evaluation  */}
        <TabPanel value={value} index={1}>
          <Stack spacing={2}>
            <Card sx={{ p: 1 }}>
              <EmployeeEvaluationView
                subTitle="10 Jan 2024"
                expanded={expanded}
                onChange={handleAccordionChange}
                index={0}
              />
              <EmployeeEvaluationView
                subTitle="10 Jan 2023"
                onChange={handleAccordionChange}
                expanded={expanded}
                index={1}
              />
              <EmployeeEvaluationView
                subTitle="10 Jan 2022"
                onChange={handleAccordionChange}
                expanded={expanded}
                index={2}
              />
            </Card>
          </Stack>
        </TabPanel>
      </Box>
    </Drawer>
  );
};
