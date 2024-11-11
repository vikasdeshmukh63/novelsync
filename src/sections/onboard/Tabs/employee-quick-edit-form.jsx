import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Stack, Button, Typography } from '@mui/material';

import { setOrganizationData } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';

const EmployeeQuickEditForm = ({ activeStep, handleBack, steps, handleNext }) => {
  const dispatch = useDispatch();
  const { organizationData, error, errorOrg } = useSelector((state) => state.organization);
  const defaultValues = {
    firstName: '' || organizationData?.firstName,
    lastName: '' || organizationData?.lastName,
    email: '' || organizationData?.email,
  };
  const schema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
      .matches(/^(?!.*@(gmail\.com|yahoo\.com|hotmail\.com)$).+@.+\..+$/, 'Enter official mail id')
      .required('Email is required'),
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const {
    reset,
    getValues,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    dispatch(setOrganizationData(data));
    handleNext();
  });

  return (
    <Box my={2} p={2}>
      <Typography variant="h4">Add First Employee</Typography>
      {error && errorOrg?.name === 'Employee already exists.' && (
        <Grid item sm={12}>
          <Typography sx={{ color: 'red' }} variant="caption">
            Cannot Create Organization & Account
          </Typography>
          <Typography sx={{ color: 'red' }} component="div">
            <ul>
              {Object.values(errorOrg).map((item, index) => (
                <li key={index}>
                  <Typography sx={{ color: 'red' }} variant="caption">
                    {item}
                  </Typography>
                </li>
              ))}
            </ul>
          </Typography>
        </Grid>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid my={2} p={2} boxShadow={2} gap={3} borderRadius="10px" container alignItems="center">
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                First Name
              </Typography>
              <Field.Text name="firstName" label="First Name" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Last Name
              </Typography>
              <Field.Text name="lastName" label="Last Name" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Email Id(official)
              </Typography>
              <Field.Text name="email" label="Email" />
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{ background: activeStep === steps.length - 1 && '#00A76F' }}
          >
            {activeStep === steps.length - 1 ? 'Create Organization' : 'Continue'}
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

export default EmployeeQuickEditForm;
