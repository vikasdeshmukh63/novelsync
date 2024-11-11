import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Stack, Button, Typography } from '@mui/material';

import { setOrganizationData } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify/iconify';

const DepartmentQuickEditForm = ({ activeStep, handleBack, steps, handleNext }) => {
  const dispatch = useDispatch();
  const { organizationData } = useSelector((state) => state.organization);
  const defaultValues = {
    departmentName: '' || organizationData?.departmentName,
    shortCode: '' || organizationData?.shortCode,
  };
  const schema = Yup.object().shape({
    departmentName: Yup.string().required('Department is required'),
    shortCode: Yup.string().max(5).required('Short Code is required'),
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
      <Typography variant="h4">Add Department</Typography>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid my={2} p={2} boxShadow={2} gap={3} borderRadius="10px" container alignItems="center">
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Department Name
              </Typography>
              <Field.Text name="departmentName" label="Ex. Research and Developement" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Short Code
              </Typography>
              <Stack gap={2}>
                <Field.Text name="shortCode" label="Ex. R&D" />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={24} />
                  <Typography> Max 5 characters</Typography>
                </Box>
              </Stack>
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

export default DepartmentQuickEditForm;
