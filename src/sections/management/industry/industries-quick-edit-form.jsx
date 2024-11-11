'use client';

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
import {
  editIndustry,
  createIndustry,
  fetchIndustrytList,
  searchIndustryByQuery,
} from 'src/redux/slices/industry';

import { Form, Field } from 'src/components/hook-form';

// style
const style = {
  width: 400,
  boxShadow: 24,
  p: 4,
};

export default function IndustryQuickEditForm({
  page,
  rowsPerPage,
  filters,
  Status,
  currentIndustry,
  type,
  open,
  onClose,
}) {
  // state
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const dispatch = useDispatch();

  // to find error from redux
  const { error } = useSelector((state) => state.industries);

  // default values
  const defaultValues = {
    industryName: currentIndustry?.name || '',
    description: currentIndustry?.description || '',
    isVerified: currentIndustry?.isActive,
  };

  // schema
  const industrySchema = yup.object().shape({
    industryName: yup.string().required('Industry Name Required'),
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
      name: data.industryName,
      description: data.description,
    };
    try {
      if (type === CONSTANTS.EDIT) {
        payload.isActive = data.isVerified;
        await dispatch(editIndustry(currentIndustry?.id_str, payload));
      } else {
        await dispatch(createIndustry(payload));
      }
      if (!filters.name) {
        await dispatch(fetchIndustrytList(page + 1, rowsPerPage, Status));
      } else if (filters.name && filters.name.length > 2) {
        // debouncing and trottling to reduce number of api calls on searching
        await dispatch(searchIndustryByQuery(page + 1, rowsPerPage, filters.name, Status));
      }
      setIsSubmitted(true);
    } catch (err) {
      toast.error('Unable to add Industry!', { variant: 'error' });
    }
  });

  // for showing submitted form error msgs
  React.useEffect(() => {
    if (isSubmitted && error) {
      toast.error('Unable to add Industry!', { variant: 'error' });
      onClose();
      setIsSubmitted(false);
    }
    if (isSubmitted && !error) {
      if (type === CONSTANTS.EDIT) {
        toast.success('Industry updated Successfully');
        reset();
        onClose();
        setIsSubmitted(false);
      } else {
        toast.success('Industry added Successfully');
        reset();
        onClose();
        setIsSubmitted(false);
      }
    }
  }, [isSubmitted, error, reset, onClose, type]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '0px' } }}>
        <Form onSubmit={onsubmit} methods={methods}>
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                {type === CONSTANTS.EDIT ? 'Edit Industry' : 'Add Industry'}
              </Typography>
              <Stack my={2} spacing={2}>
                <Box>
                  <Field.Text name="industryName" label="Name of Industry" />
                </Box>
                <Box>
                  <Field.Text multiline rows={4} name="description" label="Description" />
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
