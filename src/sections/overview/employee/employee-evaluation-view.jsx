import { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { EmployeeMediaView } from './employee-media-view';
import { EmployeeInterviewView } from './employee-interview-view';

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

export const EmployeeEvaluationView = ({ index, expanded, onChange, subTitle }) => {
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Accordion expanded={expanded === index} onChange={onChange(index)}>
      <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
        <Typography variant="subtitle1">{subTitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
          <Tab label="Interview" {...a11yProps(0)} />
          <Tab label="Media" {...a11yProps(1)} />
        </Tabs>
        <Divider />
        {/* employee details  */}
        <TabPanel value={value} index={0}>
          <EmployeeInterviewView />
        </TabPanel>
        {/* employee evaluation  */}
        <TabPanel value={value} index={1}>
          <EmployeeMediaView />
        </TabPanel>
      </AccordionDetails>
    </Accordion>
  );
};
