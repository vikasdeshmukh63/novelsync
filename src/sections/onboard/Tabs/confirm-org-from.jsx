import * as Yup from 'yup';
import { toast } from 'sonner';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Stack, Button, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { setAccError, createOrganization } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';

const ConfirmOrgForm = ({ setActiveStep, activeStep, handleBack, steps, handleNext }) => {
  const { organizationData, error } = useSelector((state) => state.organization);
  const isSubmitted = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = {
    isVarified: false,
  };

  const schem = Yup.object().shape({
    isVarified: Yup.boolean(),
  });
  const methods = useForm({
    resolver: yupResolver(schem),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const status = watch();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        prof_id: organizationData?.uploadLogo,
        comp_name: organizationData?.companyName,
        comp_industry_id: organizationData?.industryName?.id_str,
        comp_size: organizationData?.employeeCount?.size,
        comp_web_url: organizationData?.website,
        loc_hq_street: organizationData?.street,
        loc_hq_house: organizationData?.houseNo,
        loc_hq_city: organizationData?.city,
        loc_hq_state: organizationData?.state,
        loc_hq_zip: organizationData?.zipCode,
        loc_hq__country_id: organizationData?.country?.code,
        dep_name: organizationData?.departmentName,
        dep_code: organizationData?.shortCode,
        emp_first_name: organizationData?.firstName,
        emp_last_name: organizationData?.lastName,
        emp_email_id: organizationData?.email,
      };
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });
      dispatch(createOrganization(formData));
      isSubmitted.current = true;
    } catch (err) {
      toast.error('Unable to add Organization!', { variant: 'error' });
    }
  });
  React.useEffect(() => {
    if (isSubmitted.current && !error) {
      toast.success('Organization added Successfully');
      router.push('/auth/createorg');
    } else if (isSubmitted.current && error) {
      if (error && error.status === 'SERVER_ERROR') {
        if (error.message.includes('Employee already exists.')) {
          setActiveStep(2);
          dispatch(setAccError({ name: 'Employee already exists.' }));
        }
        if (error.message.includes('Company name already exists.')) {
          setActiveStep(0);
          dispatch(setAccError({ name: 'Company Name Already registered.' }));
        }
      }
      if (error) {
        toast.error('Unable to add Organization!', { variant: 'error' });
      }
    }
  }, [dispatch, error, organizationData, router, setActiveStep]);

  return (
    <Box my={2} p={2}>
      <Typography variant="h4">Confirm and Create Organization</Typography>
      <Stack gap={4}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container borderRadius="10px" boxShadow={2} p={3} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" style={{ fontSize: '18px', fontWeight: 600 }}>
                Organization
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Name
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.companyName}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Industry
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.industryName?.name}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  No of Employees
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.employeeCount?.size}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Website
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.website}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  House No
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.houseNo}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Street
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.street}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  City/Town
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.city}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  State
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.state}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Country
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.country?.name}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Zip/Postal code
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.zipCode}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid container borderRadius="10px" boxShadow={2} p={3} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" style={{ fontSize: '18px', fontWeight: 600 }}>
                Department
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Name
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.departmentName}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Short Code
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.shortCode}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid container borderRadius="10px" boxShadow={2} p={3} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" style={{ fontSize: '18px', fontWeight: 600 }}>
                Employee
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  First Name
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.firstName}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Last Name
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.lastName}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  Email Id
                </Typography>
                <Typography
                  width="50%"
                  variant="caption"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {organizationData?.email}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="#919eab"
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                *Above employee will be assigned Admin role to your organization. You can further
                add more employees to Admin and other roles from above account.
              </Typography>
            </Grid>
          </Grid>
          <Grid container borderRadius="10px" boxShadow={2} p={3} spacing={2}>
            <Grid item xs={12}>
              <Field.Switch name="isVarified" label="Accept Terms & Conditions" align="right" />
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
              disabled={!status.isVarified}
              variant="contained"
              sx={{ background: activeStep === steps.length - 1 && '#00A76F' }}
            >
              {activeStep === steps.length - 1 ? 'Create Organization' : 'Continue'}
            </Button>
          </Box>
        </Form>
      </Stack>
    </Box>
  );
};

export default ConfirmOrgForm;
