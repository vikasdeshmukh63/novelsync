'use client';

import React, { useState } from 'react';

import { Step, Stepper, StepLabel, Container, Button, Box } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { CreateNewUser } from './create-user';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { AssignRoleToUser } from './assign-role';
import CustomerSuccess from './success';

const steps = ['Create User', 'Role'];

const MainForm = () => {
  // states
  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

  // eslint-disable-next-line consistent-return
  const handleBackButtonFunction = () => {
    if (activeStep === 0) {
      return router.back();
    }
    if (activeStep === 1) {
      return setActiveStep((prev) => prev - 1);
    }
  };
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {activeStep !== 2 && (
        <Button
          sx={{ alignSelf: 'flex-start' }}
          variant="outlined"
          startIcon={<Icon icon="uil:arrow-left" />}
          onClick={handleBackButtonFunction}
        >
          Back
        </Button>
      )}
      <Container maxWidth="sm">
        {activeStep !== 2 && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    classes: {
                      root: 'stepIcon',
                    },
                  }}
                  classes={{
                    label: 'stepLabel',
                  }}
                >
                  <span>{label}</span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Box mt={3}>
          {activeStep === 0 && <CreateNewUser setActiveStep={setActiveStep} />}

          {activeStep === 1 && <AssignRoleToUser setActiveStep={setActiveStep} />}

          {activeStep === 2 && <CustomerSuccess setActiveStep={setActiveStep}/>}
        </Box>
      </Container>
    </DashboardContent>
  );
};

export default MainForm;
