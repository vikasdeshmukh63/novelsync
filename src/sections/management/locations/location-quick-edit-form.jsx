import * as yup from 'yup';
import * as React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Stack, Dialog } from '@mui/material';
import Typography from '@mui/material/Typography';

import { finderFunction } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';
import { searchCompanies } from 'src/redux/slices/company';
import {
  editLocation,
  createLocation,
  searchLocations,
  fetchLocationList,
} from 'src/redux/slices/locations';

import { Form, Field } from 'src/components/hook-form';

const style = {
  width: 400,
  boxShadow: 24,
  p: 4,
};

export default function LocationQuickEditForm({
  currentLocation,
  open,
  onClose,
  type,
  page,
  rowsPerPage,
  Status,
  filters,
  selectedCompany,
}) {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // extracting data from the redux
  const { error } = useSelector((state) => state.locations);
  const { companies } = useSelector((state) => state.company);
  const { countries } = useSelector((state) => state.general);

  const defaultValues = {
    organization: currentLocation?._company_id || null,
    name: currentLocation?.name || '',
    house: currentLocation?.house || '',
    street: currentLocation?.street || '',
    city: currentLocation?.city || '',
    state: currentLocation?.state || '',
    country_id: finderFunction('code', currentLocation?.country_id, countries) || null,
    zipcode: currentLocation?.zipcode || '',
    isActive: currentLocation?.isActive,
  };

  const industrySchema = yup.object().shape({
    organization: yup.object().required('Organization Name Required'),
    name: yup.string().required('LocationName required'),
    house: yup.string().required('House No required'),
    street: yup.string().required('Street required'),
    city: yup.string().required('CityName required'),
    state: yup.string().required('StateName required'),
    country_id: yup.object().required('CountryName required'),
    zipcode: yup
      .string()
      .matches(/^\d{5,6}$/, 'Zip code must be 5 or 6 digits')
      .required('zipcode required'),
    isActive: yup.boolean(),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(industrySchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const status = watch();

  const onsubmit = handleSubmit(async (data) => {
    const payload = {
      name: data.name,
      company_id: data.organization.id_str,
      city: data.city,
      state: data.state,
      country_id: data.country_id.code,
      zipcode: data.zipcode,
      house: data.house,
      street: data.street,
    };

    try {
      if (type === CONSTANTS.CREATE) {
        await dispatch(createLocation(payload));
      }
      if (type === CONSTANTS.EDIT) {
        payload.isActive = data.isActive;
        await dispatch(editLocation(currentLocation?.id_str, payload));
      }
      setIsSubmitted(true);
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  });
  // for showing submitted form error msgs
  React.useEffect(() => {
    if (isSubmitted && error) {
      toast.error(`Unable to ${type === CONSTANTS.CREATE ? 'add' : 'edit'} Location!`, {
        variant: 'error',
      });
      onClose();
      setIsSubmitted(false);
    }
    if (isSubmitted && !error) {
      toast.success(`Location ${type === CONSTANTS.CREATE ? 'added' : 'edited'} Successfully`);
      if (!filters.name) {
        // fetch department list
        dispatch(fetchLocationList(page, rowsPerPage, Status, selectedCompany?.id_str));
      } else if (filters.name.length > 2) {
        // search department list by name
        dispatch(searchLocations(filters.name, Status));
      }
      onClose();
      setIsSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, error]);
  const handleSearchCompanies = (event) => {
    const query = event.target.value;
    if (query.length > 3) {
      dispatch(searchCompanies(event.target.value));
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '0px' } }}>
        <Form onSubmit={onsubmit} methods={methods}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {type === CONSTANTS.EDIT ? 'Edit Location' : 'Add Location'}
            </Typography>
            <Stack my={2} spacing={2}>
              <Box>
                <Field.Autocomplete
                  handleSearch={handleSearchCompanies}
                  name="organization"
                  options={companies}
                  getOptionLabel={(option) => option?.name}
                  label="Search Organization"
                />
              </Box>
              <Box>
                <Field.Text name="name" label="Name of Location" />
              </Box>
              <Box>
                <Field.Text name="house" label="House No" />
              </Box>
              <Box>
                <Field.Text name="street" label="Street" />
              </Box>
              <Box>
                <Field.Text name="city" label="City/Town" />
              </Box>
              <Box>
                <Field.Text name="state" label="State" />
              </Box>
              <Box>
                <Field.Autocomplete
                  name="country_id"
                  options={countries}
                  getOptionLabel={(option) => option?.name}
                  label="Search Country"
                />
              </Box>
              <Box>
                <Field.Text name="zipcode" label="zipcode" />
              </Box>
              {type === CONSTANTS.EDIT && (
                <Field.Switch
                  name="isActive"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {status.isActive ? 'Active' : 'Rejected'}
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
        </Form>
      </Dialog>
    </div>
  );
}
