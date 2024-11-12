'use client';

import * as yup from 'yup';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Alert,
  Stack,
  Divider,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import CustomLabel from 'src/components/hook-form/label/custom-label';
import { createUser, setRecruitersData } from 'src/redux/slices/customers';

export const CreateNewUser = ({ setActiveStep }) => {
  const { error: formErr, recruiterData } = useSelector((state) => state.customers);

  const password = useBoolean(true);
  const confirmPassword = useBoolean(true);

  // function to show or hide password
  const togglePasswordVisibility = () => {
    password.onToggle();
  };

  const toggleConfirmPasswordVisibility = () => {
    confirmPassword.onToggle();
  };

  // states
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const isSubmitted = useBoolean();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();

  // schema
  const CreateNewUserSchema = yup.object().shape({
    prof_id: yup.mixed().nullable().required('Profile photo is required'),
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    email_id: yup.string().required('Email is required').email('Enter valid email'),
    phoneNumber: yup.string().required('Phone number is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/.><,])(?=.*\d)[A-Za-z\d!@#$%^&*()_+}{"':;?/.><,]{8,}$/,
        'Password must be at least 8 characters long, contain at least one special character, and one capital letter'
      ),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  // default values
  const defaultValues = {
    prof_id: recruiterData?.prof_id || null,
    first_name: recruiterData?.first_name || '',
    last_name: recruiterData?.last_name || '',
    email_id: recruiterData?.email_id || '',
    phoneNumber: recruiterData?.phoneNumber || '',
    password: recruiterData?.password || '',
    confirmPassword: recruiterData?.confirmPassword || '',
  };

  // methods
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(CreateNewUserSchema),
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  // form submit
  const onSubmit = handleSubmit(async (data) => {
    const phoneNumber = parsePhoneNumber(data.phoneNumber);
    const values = {
      ...data,
      mobile_code: `+${phoneNumber.countryCallingCode}`,
      mobile_no: phoneNumber.nationalNumber,
    };

    try {
      await dispatch(setRecruitersData(values));
      setActiveStep((prev) => prev + 1);
      isSubmitted.onTrue();
    } catch (err) {
      toast.error('something went wrong', { variant: 'error' });
    }
  });

  // handle drop photo
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('prof_id', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // show the alert
  useEffect(() => {
    let timer;
    if (showAlert.show) {
      timer = setTimeout(() => {
        setShowAlert({
          show: false,
          message: '',
          variant: '',
        });
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert.show]);

  const handleInputChange = () => {
    setIsButtonDisabled(false); // Re-enable the button on input change
  };
  return (
    <Card>
      <Stack spacing={1} p={3}>
        <Typography variant="h6">Personal Details</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider />
      <Form methods={methods} onSubmit={onSubmit} onChange={handleInputChange}>
        <Grid container spacing={2} justifyContent="flex-end" p={3}>
          <Grid item xs={12}>
            <Field.UploadAvatar
              name="prof_id"
              maxSize={3250585}
              onDrop={handleDrop}
              label="Update Photo"
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

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="First Name" required />
              <Field.Text name="first_name" placeholder="Enter First Name" />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Last Name" required />
              <Field.Text name="last_name" placeholder="Enter Last Name" />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Email" required />

              <Stack gap={2}>
                <Field.Text name="email_id" placeholder="Enter Office Email ID" />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption">Please enter your official email id</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Mobile No" required />
              <Field.Phone name="phoneNumber" placeholder="Enter your phone number" />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <CustomLabel title="Password" required />
            <Field.Text
              name="password"
              placeholder="Enter Strong Password"
              type={password.value ? 'password' : 'text'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={togglePasswordVisibility}>
                      <Icon
                        icon={
                          password.value ? 'ic:baseline-visibility-off' : 'ic:baseline-visibility'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box display="flex" gap={1} color="#637381" mt={2}>
              <Iconify icon="material-symbols:info" width={18} />
              <Typography variant="caption">
                Min 10 characters, at least 1 uppercase, 1 small case, 1 special character
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <CustomLabel title="Confirm Password" required />
            <Field.Text
              name="confirmPassword"
              placeholder="Enter Strong Password"
              type={confirmPassword.value ? 'password' : 'text'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={toggleConfirmPasswordVisibility}>
                      <Icon
                        icon={
                          confirmPassword.value
                            ? 'ic:baseline-visibility-off'
                            : 'ic:baseline-visibility'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                {showAlert.show && (
                  <Alert
                    sx={{ width: 1 }}
                    variant="outlined"
                    severity={showAlert.variant}
                    onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
                  >
                    {showAlert.message}
                  </Alert>
                )}
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" justifyContent="end">
                  <LoadingButton
                    color="success"
                    type="submit"
                    startIcon={<Iconify icon="bxs:file" />}
                    disabled={isButtonDisabled || isSubmitting}
                    // disabled={disableSaveBtn}
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Card>
  );
};
