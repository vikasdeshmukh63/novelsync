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
  Button,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';

import { createUser, setRecruitersData } from 'src/redux/slices/customers';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import CustomLabel from 'src/components/hook-form/label/custom-label';
import { searchRoles } from 'src/redux/slices/roles';

export const AssignRoleToUser = ({ setActiveStep }) => {
  const { roles } = useSelector((state) => state.roles);
  const { recruiterData, error: formErr } = useSelector((state) => state.customers);

  // states
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const isSubmitted = useBoolean();

  const dispatch = useDispatch();

  // schema
  const assignRoleToUserSchema = yup.object().shape({
    role: yup.object().required('Role is required'),
    isAccept: yup.bool(),
  });

  // default values
  const defaultValues = {
    role: null,
    isAccept: false,
  };

  // methods
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(assignRoleToUserSchema),
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // form submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      const finalObj = { ...recruiterData, port_role_id: data.role.id };

      Object.keys(finalObj).forEach((key) => {
        formData.append(key, finalObj[key]);
      });

      await dispatch(createUser(formData));

      isSubmitted.onTrue();
    } catch (err) {
      toast.error('something went wrong');
    }
  });

  const handleRoleSearch = async (e) => {
    try {
      const query = e.target.value;
      if (query.length > 3) {
        await dispatch(searchRoles(0, 1000, query));
      }
    } catch (err) {
      toast.error('something went wrong');
    }
  };

  // form submitting error handling
  useEffect(() => {
    if (isSubmitted.value && formErr) {
      toast.error('Someting Went Wrong');
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      toast.success('Customer Added Successfully');
      isSubmitted.onFalse();
      setActiveStep((prev) => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

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

  return (
    <Card>
      <Stack spacing={1} p={3}>
        <Typography variant="h6">Personal Details</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2} justifyContent="flex-end" p={3}>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight={600}>
              Email
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={600}>
              {recruiterData.email_id}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Select Role" required />

              <Field.Autocomplete
                options={roles || []}
                handleSearch={handleRoleSearch}
                getOptionLabel={(option) => option.name}
                name="role"
                placeholder="Select Role"
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Field.Switch
              name="isAccept"
              label="Accpet Terms and Conditions"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#22C55E',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#22C55E !important',
                },
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button variant="outlined" onClick={() => setActiveStep((prev) => prev - 1)}>
              Back
            </Button>
            <Button variant="contained" type="submit" disabled={!watch().isAccept}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Form>
    </Card>
  );
};
