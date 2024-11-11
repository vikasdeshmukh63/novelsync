import * as Yup from 'yup';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

// mui imports
import { Box, Grid, Alert, Stack, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { manuallyAddEmployee } from 'src/redux/slices/invites';

import { Form, Field } from 'src/components/hook-form';

// ! component
const ManualInviteEmployees = ({ handleCloseModal }) => {
  // redux to dispatch
  const dispatch = useDispatch();

  // custom hooks
  const isSubmitted = useBoolean();

  // extract the data from redux
  const { userInfo } = useSelector((state) => state.signUp);
  const { error, invitedData } = useSelector((state) => state.invites);

  // generating dynamic schema
  const schema = Yup.object().shape(
    Array.from({ length: 10 })
      .map((_, index) => {
        const firstNameKey = `firstName${index + 1}`;
        const lastNameKey = `lastName${index + 1}`;
        const employeeEmailKey = `employeeEmail${index + 1}`;
        return {
          [firstNameKey]: Yup.string(),
          [lastNameKey]: Yup.string().when(firstNameKey, {
            is: (name) => !!name && name.length > 0,
            then: () => Yup.string().required('Last Name is required'),
          }),
          [employeeEmailKey]: Yup.string().when([firstNameKey, lastNameKey], {
            is: (first, last) => !!first && !!last,
            then: () => Yup.string().email('Invalid email').required('Employee Email is required'),
            otherwise: () => Yup.string().email('Invalid email'),
          }),
        };
      })
      .reduce((acc, obj) => ({ ...acc, ...obj }), {})
  );

  const defaultValues = Array.from({ length: 10 })
    .map((_, index) => {
      const firstNameKey = `firstName${index + 1}`;
      const lastNameKey = `lastName${index + 1}`;
      const employeeEmailKey = `employeeEmail${index + 1}`;

      return {
        [firstNameKey]: '',
        [lastNameKey]: '',
        [employeeEmailKey]: '',
      };
    })
    .reduce((acc, obj) => ({ ...acc, ...obj }), {});

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = methods;
  const convertData = (values) => {
    const data = Object.entries(values);
    const result = data.reduce((acc, [key, value], index) => {
      if (index % 3 === 0 && value && data[index + 1][1] && data[index + 2][1]) {
        acc.push({
          inviter_id: userInfo?.id_str,
          first_name: value,
          last_name: data[index + 1][1],
          email: data[index + 2][1],
        });
      }
      return acc;
    }, []);

    return result;
  };
  const onSubmit = handleSubmit(async (values) => {
    const isAtLeastOneEmployeeEntered = Object.values(values).some(
      (value, index) => index % 2 === 0 && value.trim() !== ''
    );
    // if its empty then setting error
    if (!isAtLeastOneEmployeeEntered) {
      console.log(isAtLeastOneEmployeeEntered);
      // Set error for the first field (employeeName1)
      setError('firstName1', {
        type: 'required',
        message: 'You must enter at least one Employee detail',
      });
      return;
    }
    const finalData = convertData(values);

    await dispatch(manuallyAddEmployee({ data: finalData }));
    isSubmitted.onTrue();
  });

  useEffect(() => {
    if (isSubmitted.value && error) {
      toast.error('Unable to add Employee!');
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !error) {
      toast.success('Employee added Successfully!');
      isSubmitted.onFalse();
      handleCloseModal();
    }
  }, [error, handleCloseModal, isSubmitted]);

  const renderFields = () =>
    Array.from({ length: 10 }).map((item, index) => (
      <React.Fragment key={index + 1}>
        {/* employee First name  */}
        <Grid item sm={12} lg={4}>
          <Field.Text label="Full Name" name={`firstName${index + 1}`} />
        </Grid>
        {/* employee Last name  */}

        <Grid item sm={12} lg={4}>
          <Field.Text label="Last Name" name={`lastName${index + 1}`} />
        </Grid>
        {/* Employee email  */}
        <Grid item sm={12} lg={4}>
          <Field.Text label="Email Address" name={`employeeEmail${index + 1}`} />
        </Grid>
      </React.Fragment>
    ));

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        {renderFields()}

        <Grid item xs={12}>
          {invitedData.length > 0 && error && (
            <Stack my={2}>
              <Stack alignItems="center">
                <Alert sx={{ width: '80%' }} variant="filled" severity="error">
                  {error}
                </Alert>
              </Stack>

              <Stack
                my={2}
                direction="row"
                flexWrap="wrap"
                gap="5px"
                justifyContent="space-between"
              >
                {invitedData?.map((data) => (
                  <Stack
                    key={data?.id_str}
                    width="230px"
                    sx={{ boxShadow: 3, borderRadius: '5px', padding: '10px' }}
                  >
                    <Typography variant="caption" color="error" fontSize="14px">
                      {data.email}
                    </Typography>
                    <Stack direction="row" gap={1}>
                      <Typography variant="caption" color="error">
                        {data.isDuplicate && 'Duplicated'}
                      </Typography>
                      <Typography variant="caption" color="error">
                        {!data.isValidEmail && 'Invalid Email'}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </Grid>

        {/* action buttons  */}
        <Grid item md={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 3,
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Add Employees
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
};

export default ManualInviteEmployees;
