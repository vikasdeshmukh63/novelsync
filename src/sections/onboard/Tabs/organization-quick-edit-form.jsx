import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import React, { useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Stack, Button, Typography } from '@mui/material';

import { fData } from 'src/utils/format-number';

import { fetchCountries } from 'src/redux/slices/general';
import { searchIndustry } from 'src/redux/slices/industry';
import { setOrganizationData } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';

const companySize = [
  { id: 1, size: '1-10' },
  { id: 2, size: '11-50' },
  { id: 3, size: '51-100' },
  { id: 4, size: '101-500' },
  { id: 5, size: '501-1000' },
  { id: 6, size: 'Above 1000' },
];

const OrganizationQuickEditForm = ({ activeStep, handleBack, steps, handleNext }) => {
  const { organizationData, error, errorOrg } = useSelector((state) => state.organization);
  const { searchedIndustry } = useSelector((state) => state.industries);
  const { countries } = useSelector((state) => state.general);
  const dispatch = useDispatch();
  // regex for website
  const websiteUrlRegex =
    /^((https?|ftp|smtp):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

  const defaultValues = {
    uploadLogo: null || organizationData?.uploadLogo,
    companyName: '' || organizationData?.companyName,
    industryName: null || organizationData?.industryName,
    employeeCount: null || organizationData?.employeeCount,
    website: '' || organizationData?.website,
    houseNo: '' || organizationData?.houseNo,
    street: '' || organizationData?.street,
    city: '' || organizationData?.city,
    state: '' || organizationData?.state,
    country: null || organizationData?.country,
    zipCode: '' || organizationData?.zipCode,
  };

  const schema = Yup.object().shape({
    uploadLogo: Yup.mixed().nullable().required('Logo is requirerd'),
    companyName: Yup.string().required('Company Name is requirerd'),
    industryName: Yup.object().required('Telecom required'),
    employeeCount: Yup.object().required('Number of Employees required'),
    website: Yup.string()
      .required('Website  is requirerd')
      .matches(websiteUrlRegex, 'Invalid URL. Please enter a valid website.'),
    houseNo: Yup.string().required('House No  is requirerd'),
    street: Yup.string().required('Street  is requirerd'),
    city: Yup.string().required('City  is requirerd'),
    state: Yup.string().required('State  is requirerd'),
    country: Yup.object().required('Country  is requirerd'),
    zipCode: Yup.string()
      .matches(/^\d{5,6}$/, 'Zip code must be 5 or 6 digits')
      .required('Zipcode is required'),
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
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('uploadLogo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const handleSearchIndustry = (event) => {
    const { value } = event.target;
    if (value) dispatch(searchIndustry(value));
  };

  // to fetch countries
  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries.length, dispatch]);
  return (
    <Box>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid my={2} p={2} boxShadow={2} gap={3} borderRadius="10px" container alignItems="center">
          {error && errorOrg?.name === 'Company Name Already registered.' && (
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
          <Grid item xs={12}>
            <Field.UploadAvatar
              name="uploadLogo"
              label="upload Logo"
              maxSize={3250585}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3250585)}
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Organization Name
              </Typography>
              <Field.Text name="companyName" label="Name of your Company" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Select Industry
              </Typography>
              <Field.Autocomplete
                handleSearch={handleSearchIndustry}
                name="industryName"
                options={searchedIndustry}
                getOptionLabel={(option) => option?.name}
                label="Telecom"
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Select Number of Employees
              </Typography>
              <Field.Autocomplete
                name="employeeCount"
                options={companySize}
                getOptionLabel={(option) => option?.size}
                label="11-100"
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Website Url
              </Typography>
              <Field.Text name="website" label="https://www.novelhire.com" />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                House No
              </Typography>
              <Field.Text name="houseNo" label="House No" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Street
              </Typography>
              <Field.Text name="street" label="Street" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                City/Town
              </Typography>
              <Field.Text name="city" label="City/Town" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                State
              </Typography>
              <Field.Text name="state" label="State" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Country
              </Typography>
              <Field.Autocomplete
                name="country"
                options={countries}
                getOptionLabel={(option) => option?.name}
                label="Country"
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Zip/Postal Code
              </Typography>
              <Field.Text name="zipCode" label="zip/postal code" />
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

export default OrganizationQuickEditForm;
