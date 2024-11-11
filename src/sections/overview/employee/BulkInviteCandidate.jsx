// next link
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui imports
import { Box, Grid, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';

import { uploadInviteFile } from 'src/redux/slices/invites';

import { Form, Field } from 'src/components/hook-form';

// assets

const BulkInviteEmployees = ({ handleCloseModal }) => {
  // redux to extract the data
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.signUp);
  const { error } = useSelector((state) => state.invites);

  // custom hooks
  const isSubmitted = useBoolean();

  const NewBlogSchema = Yup.object().shape({
    uploadFile: Yup.mixed().required('Cover is required'),
  });

  const defaultValues = {
    uploadFile: null,
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const { setValue, handleSubmit } = methods;

  const onsubmit = async (data) => {
    try {
      await dispatch(uploadInviteFile(userInfo?.id_str, data?.uploadFile));
      isSubmitted.onTrue();
    } catch (err) {
      toast.error('Unable to add Employee!');
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('uploadFile', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // to remove the file
  const handleRemoveFile = () => {
    setValue('uploadFile', null);
  };

  // to close modal
  const handleCloseModalWithClearData = () => {
    handleCloseModal();
  };

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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/EmployeeTemplate.xlsx';
    link.setAttribute('download', 'example.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container spacing={3} p={1}>
      {/* description  */}
      <Form methods={methods} onSubmit={handleSubmit(onsubmit)}>
        <Grid item md={12}>
          <Typography fontSize="15px" py={1}>
            Now you can invite candidates for the Job Post from an excel file in single shot. Please
            download template file from
            <Button
              onClick={handleDownload}
              disableRipple
              style={{
                color: '#2196F3',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              here.
            </Button>
          </Typography>
        </Grid>

        {/* file input  */}
        <Grid item md={12}>
          <Field.Upload
            name="uploadFile"
            accept={{
              'application/vnd.ms-excel': [],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
            }}
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
                Allowed docx
                <br /> max size of {fData(5242880)}
              </Typography>
            }
            maxSize={5242880}
            onDrop={handleDrop}
            onDelete={handleRemoveFile}
          />
        </Grid>

        {/* action buttons  */}
        <Grid item md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
            <Button variant="outlined" onClick={handleCloseModalWithClearData}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Form>
    </Grid>
  );
};

export default BulkInviteEmployees;
