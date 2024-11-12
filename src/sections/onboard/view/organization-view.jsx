'use client';

import * as React from 'react';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

import ConfirmOrgForm from '../Tabs/confirm-org-from';
import EmployeeQuickEditForm from '../Tabs/employee-quick-edit-form';
import DepartmentQuickEditForm from '../Tabs/department-quick-edit-form';
import OrganizationQuickEditForm from '../Tabs/organization-quick-edit-form';

const steps = ['Organization', 'Department', 'Employee', 'Confirm'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: '700px', margin: '0 auto' }}>
      <Typography my={2} variant="h4" textAlign="center">
        Onboard Organization
      </Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <>
        {activeStep === 0 && (
          <OrganizationQuickEditForm
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            activeStep={activeStep}
          />
        )}
        {activeStep === 1 && (
          <DepartmentQuickEditForm
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            activeStep={activeStep}
          />
        )}
        {activeStep === 2 && (
          <EmployeeQuickEditForm
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            activeStep={activeStep}
          />
        )}
        {activeStep === 3 && (
          <ConfirmOrgForm
            setActiveStep={setActiveStep}
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            activeStep={activeStep}
          />
        )}
      </>
    </Box>
  );
}
