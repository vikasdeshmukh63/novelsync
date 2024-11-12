import * as yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import React, { useEffect, forwardRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Slide, Stack, Dialog, Button, Divider, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import {
  createPermission,
  fetchPermissions,
  udpatePermissions,
} from 'src/redux/slices/permissions';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const PermissionTableModal = ({ open, onClose, type, data = null, status, page, rowsPerPage }) => {
  const submit = useBoolean();

  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.roles);
  const defaultValues = {
    name: data?.name || '',
    code: data?.code || '',
    description: data?.description || '',
    ...(type === CONSTANTS.EDIT && { isActive: data?.isActive || false }),
  };

  const schema = yup.object().shape({
    name: yup.string().required('Permission Name is required'),
    code: yup.string().required('Code is required'),
    description: yup.string().required('Description is required'),
    ...(type === CONSTANTS.EDIT && {
      isActive: yup.boolean().required('Status is required'),
    }),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onsubmit = handleSubmit(async (result) => {
    try {
      if (type === CONSTANTS.EDIT) {
        await dispatch(udpatePermissions(result, data?.id));
        submit.onTrue();
      } else {
        await dispatch(createPermission(result));
        submit.onTrue();
      }
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  });

  useEffect(() => {
    if (submit.value && !error) {
      toast.success(
        type === CONSTANTS.EDIT ? 'Permission Updated Successfully' : 'Role Created Successfully'
      );

      dispatch(fetchPermissions(page, rowsPerPage, status));
      onClose();
      reset();
      submit.onFalse();
    }
    if (submit.value && error) {
      toast.error('Something Went Wrong');
      submit.onFalse();
    }
  }, [submit.value, error, submit, onClose, reset, dispatch, type, page, rowsPerPage, status]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <Form onSubmit={onsubmit} methods={methods}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">
              {type === CONSTANTS.EDIT ? 'Edit Permission' : 'Add Permission'}
            </Typography>
            <Typography variant="caption">Title,short description,image...</Typography>
          </Box>
          <Divider />

          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">Permission Name</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Field.Text name="name" placeholder="Enter Permission Name" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">Code</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Field.Text name="code" placeholder="Enter Code" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">Description</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Field.Text name="description" placeholder="Enter Permission Description" />
            </Grid>
            {type === CONSTANTS.EDIT && (
              <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                <Field.Switch
                  name="isActive"
                  label="Active"
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
            )}
          </Grid>

          {/* action buttons  */}
          <Stack direction="row" gap={2} justifyContent="flex-end" p={2}>
            <Button variant="outlined" onClick={onClose} color="error">
              Cancel
            </Button>
            <Button
              startIcon={<Iconify icon="bxs:file" />}
              variant="contained"
              color="success"
              type="submit"
            >
              Save
            </Button>
          </Stack>
        </Form>
      </Dialog>
    </div>
  );
};

export default PermissionTableModal;