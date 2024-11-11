import * as Yup from 'yup';
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
import { searchLocations } from 'src/redux/slices/locations';
import {
  editDepartment,
  createDepartment,
  fetchDepartmentList,
  searchDepartmentList,
  searchParentDepartment,
} from 'src/redux/slices/depatment';

import { Form, Field } from 'src/components/hook-form';

// style
const style = {
  width: 400,
  boxShadow: 24,
  p: 4,
};

export default function DepartmentQuickEditForm({
  currentDepartment,
  handleDepartmentAction,
  selectedCompany,
  Status,
  open,
  onClose,
  filters,
  type,
  page,
  rowsPerPage,
}) {
  // state
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const dispatch = useDispatch();

  // to extract data from redux
  const { error, parentDepartments } = useSelector((state) => state.departments);
  const { organizations, locations } = useSelector((state) => state.locations);

  // default values
  const defaultValues = {
    departmentName: currentDepartment?.name || '',
    departmentShortCode: currentDepartment?.short_name || '',
    departMentParentName: currentDepartment?._parent_department_id || null,
    location: currentDepartment?.department_locations[0]?._location_id || null,
    isVerified: currentDepartment?.isActive,
  };

  // schema
  const NewUserSchema = Yup.object().shape({
    departmentName: Yup.string().required('DepartmentName is required'),
    departmentShortCode: Yup.string().required('DepartmentShortCode is required'),
    departMentParentName: Yup.object().required('DepartMentParentName is required'),
    location: Yup.object().required('Location is required'),
    isVerified: Yup.boolean(),
  });

  // react hook form
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // to see the status
  const status = watch();
  // submitting form
  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      name: data.departmentName,
      location_id: data.location.id_str,
      short_name: data.departmentShortCode,
      parent_department_id: data.departMentParentName.id_str,
    };
    try {
      if (type === CONSTANTS.EDIT) {
        payload.isActive = data.isVerified;
        await dispatch(editDepartment(currentDepartment?.id_str, payload));
      } else {
        await dispatch(createDepartment(payload));
      }

      setIsSubmitted(true);
    } catch (err) {
      toast.error('Unable to add Department!');
    }
  });

  // for showing submitted form error msgs
  React.useEffect(() => {
    if (isSubmitted && error) {
      toast.error(`Unable to add ${type === CONSTANTS.CREATE ? 'add' : 'edit'} Department!`, {
        variant: 'error',
      });
      onClose();
      setIsSubmitted(false);
    }
    if (isSubmitted && !error) {
      if (type === CONSTANTS.EDIT) {
        toast.success('Department updated Successfully');
        reset();
        if (!filters.name) {
          // Fetch department list
          dispatch(fetchDepartmentList(page + 1, rowsPerPage, Status, selectedCompany?.id_str));
        } else if (filters.name.length > 2) {
          // Search department list by name
          dispatch(searchDepartmentList(page + 1, rowsPerPage, Status, filters.name));
        }
        onClose();
        setIsSubmitted(false);
      } else {
        toast.success('Department added Successfully');
        reset();
        if (!filters.name) {
          // Fetch department list
          dispatch(fetchDepartmentList(page + 1, rowsPerPage, Status, selectedCompany?.id_str));
        } else if (filters.name.length > 2) {
          // Search department list by name
          dispatch(searchDepartmentList(page + 1, rowsPerPage, Status, filters.name));
        }
        onClose();
        setIsSubmitted(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, error]);

  // searching location
  const handleLocationSearch = (event) => {
    const { value } = event.target;
    if (value) dispatch(searchLocations(value));
  };

  // searching parent department
  const handleParentDepartmentSearch = (event) => {
    const { value } = event.target;
    if (value) dispatch(searchParentDepartment(value));
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '0px' } }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                {type === CONSTANTS.EDIT ? 'Edit Department' : ' Add Department'}
              </Typography>
              <Stack my={2} spacing={2}>
                <Box>
                  <Field.Text name="departmentName" label="Name of Department" />
                </Box>
                <Box>
                  <Field.Text name="departmentShortCode" label="Short Code for Department" />
                </Box>
                <Box>
                  <Field.Autocomplete
                    handleSearch={handleParentDepartmentSearch}
                    name="departMentParentName"
                    options={parentDepartments}
                    getOptionLabel={(option) => option?.name}
                    label="Search parent Department"
                  />
                </Box>

                <Box>
                  <Field.Autocomplete
                    name="location"
                    handleSearch={handleLocationSearch}
                    options={locations}
                    getOptionLabel={(option) => option.name}
                    label="Search Location"
                  />
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
