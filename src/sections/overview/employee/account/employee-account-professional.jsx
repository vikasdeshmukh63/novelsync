import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function EmployeeAccountProfessional({ cards, plans, invoices, addressBook }) {
  // defaultValues
  const defaultValues = {
    currentRole: null,
    reportingHead: null,
    department: null,
  };

  // validatations
  const schema = yup.object().shape({
    currentRole: yup.object().required('Current job  is required'),
    reportingHead: yup.object().required('Reporting manager  is required'),
    department: yup.object().required('Department  is required'),
  });

  // react hook form
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // methods from react hook form
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <Field.Autocomplete
          options={[]}
          getOptionLabel={(option) => option.name}
          name="currentRole"
          label="Current Job Role"
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Your current job role
            </Stack>
          }
        />

        <Field.Autocomplete
          options={[]}
          getOptionLabel={(option) => option.name}
          name="reportingHead"
          label="Manager"
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> You can change your
              reporting manager here. Note: changig a manager also modifies your department
              according to your manager
            </Stack>
          }
        />

        <Field.Autocomplete
          options={[]}
          getOptionLabel={(option) => option.name}
          name="department"
          label="Department"
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> You can change your
              department here
            </Stack>
          }
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </Form>
  );
}
