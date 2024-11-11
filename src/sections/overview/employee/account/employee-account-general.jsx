import * as Yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { fetchNationalId } from 'src/redux/slices/proficiency';
import { fetchCountries, fetchLanguages } from 'src/redux/slices/general';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function EmoloyeeAccountGeneral() {
  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const { countries, languages } = useSelector((state) => state.general);
  const { nationalId } = useSelector((state) => state.proficiency);

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable().required('Avatar is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    about: Yup.string().required('About is required'),
    // not required
    isPublic: Yup.boolean(),
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // handling resume
  const handleDropResumeFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (newFile) {
        setValue('uploadResume', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // to fetch countries
  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchLanguages());
    dispatch(fetchNationalId());
  }, [dispatch]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
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
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="firstName" label="First Name" />

              <Field.Text name="middleName" label="Middle Name" />
              <Field.Text name="lastName" label="Last Name" />

              <Field.Text name="email" label="Email" />
              <Stack direction="row" gap={2}>
                <Field.Autocomplete
                  name="code"
                  label="Code"
                  options={countries}
                  getOptionLabel={(option) => option.dial_code}
                />
                <Field.Text name="mobile" label="mobile" />
              </Stack>

              <Field.Autocomplete
                name="language"
                label="Language"
                options={languages}
                getOptionLabel={(option) => option.name}
              />
              <Field.Autocomplete
                name="nationalId"
                label="Id Type"
                options={nationalId}
                getOptionLabel={(option) => option.value}
              />
              <Field.Text name="nationalIdNo" label="Id Value" />
              <Box gridColumn="span 2">
                <Field.Upload
                  name="uploadResume"
                  maxSize={5242880}
                  onDrop={handleDropResumeFile}
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
                      Allowed *.pdf, *.docx, *.doc
                      <br /> max size of {fData(5242880)}
                    </Typography>
                  }
                  onDelete={() => setValue('uploadResume', null, { shouldValidate: true })}
                />
                <Typography variant="caption" fontSize="14px" color="#637381">
                  Resumes/CVs can only be changed once every 6 months
                </Typography>
              </Box>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
