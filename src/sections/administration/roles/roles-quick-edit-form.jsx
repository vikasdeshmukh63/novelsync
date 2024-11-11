import * as yup from 'yup';
import * as React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { Stack, Dialog } from '@mui/material';
import Typography from '@mui/material/Typography';

import { CONSTANTS } from 'src/constants';
import { editRoles, createRoles, fetchRolesList, searchRoleByQuery } from 'src/redux/slices/roles';

import { Form, Field } from 'src/components/hook-form';

// style
const style = {
  width: 400,
  boxShadow: 24,
  p: 4,
};
export default function RolesQuickEditForm({
  Status,
  currentRole,
  type,
  open,
  onClose,
  page,
  rowsPerPage,
  filters,
}) {
  // state
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const dispatch = useDispatch();

  // to find error from redux
  const { error } = useSelector((state) => state.roles);

  // default values
  const defaultValues = {
    roleName: currentRole?.name || '',
    description: currentRole?.desc || '',
    isVerified: currentRole?.isActive,
  };

  // schema
  const industrySchema = yup.object().shape({
    roleName: yup.string().required('Role Name Required'),
    description: yup.string().required('Description required'),
    isVerified: yup.boolean(),
  });

  // react hook form
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(industrySchema),
  });
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  // to see the status
  const status = watch();

  // submitting form
  const onsubmit = handleSubmit(async (data) => {
    const payload = {
      name: data.roleName,
      desc: data.description,
    };
    try {
      if (type === CONSTANTS.EDIT) {
        payload.isActive = data.isVerified;
        await dispatch(editRoles(currentRole?.id_str, payload));
      } else {
        await dispatch(createRoles(payload));
      }
      setIsSubmitted(true);
    } catch (err) {
      toast.error('Unable to add Role!', { variant: 'error' });
    }
  });

  // for showing submitted form error msgs
  React.useEffect(() => {
    if (isSubmitted && error) {
      toast.error('Unable to add Role', { variant: 'error' });
      onClose();
      setIsSubmitted(false);
    }
    if (isSubmitted && !error) {
      if (type === CONSTANTS.EDIT) {
        toast.success('Role updated Successfully');
        reset();
        if (!filters.name) {
          dispatch(fetchRolesList(page + 1, rowsPerPage, Status));
        } else if (filters.name && filters.name.length > 2) {
          dispatch(searchRoleByQuery(page + 1, rowsPerPage, filters.name, Status));
        }
        onClose();
        setIsSubmitted(false);
      } else {
        toast.success('Role added Successfully');
        reset();
        if (!filters.name) {
          dispatch(fetchRolesList(page + 1, rowsPerPage, Status));
        } else if (filters.name && filters.name.length > 2) {
          dispatch(searchRoleByQuery(page + 1, rowsPerPage, filters.name, Status));
        }
        onClose();
        setIsSubmitted(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, error]);
  return (
    <div>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '0px' } }}>
        <Form onSubmit={onsubmit} methods={methods}>
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                {type === CONSTANTS.EDIT ? 'Edit Roles' : 'Add Roles'}
              </Typography>
              <Stack my={2} spacing={2}>
                <Box>
                  <Field.Text name="roleName" label="Name of Role" />
                </Box>
                <Box>
                  <Field.Text multiline rows={4} name="description" label="Description..." />
                </Box>
                {type === CONSTANTS.EDIT && (
                  <Field.Switch
                    name="isVerified"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {status.isVerified ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                    sx={{ mx: 0, width: 1, justifyContent: 'start' }}
                  />
                )}
              </Stack>
              <Stack direction="row" gap={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Form>
      </Dialog>
    </div>
  );
}
