import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import { Autocomplete } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { searchCompanies } from 'src/redux/slices/company';
import { fetchLocationList } from 'src/redux/slices/locations';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LocationTableToolbar({
  filters,
  onFilters,
  rowsPerPage,
  selectedCompany,
  setSelectedCompany,
  page,
  Status,
}) {
  const popover = usePopover();
  const dispatch = useDispatch();

  // extracting data from redux
  const { companies } = useSelector((state) => state.company);

  // handling the name filter
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  // handling the org filter
  const handleFilterOrg = useCallback(
    (event) => {
      onFilters('org', event.target.value);
    },
    [onFilters]
  );

  // debouncing and throttling for the search by name
  useEffect(() => {
    let timer;

    // making api call for search companies
    if (filters.org && filters.org.length > 3) {
      timer = setTimeout(() => {
        dispatch(searchCompanies(filters.org, Status));
      }, 200);
    }

    // clearing timeout
    return () => clearTimeout(timer);
  }, [dispatch, filters.org, Status, rowsPerPage]);

  // function to handle filter value change
  const handleFilterValueChange = async (newValue) => {
    // setting the autocomplete value
    setSelectedCompany(newValue);
    // setting the filter values
    onFilters('org', newValue ? newValue.name : '');
  };

  const handleChangeSearch = (event) => {
    const name = event.target.value;
    let bool = true;
    if (name) {
      bool = false;
    }
    if (name === '' && !bool) {
      dispatch(fetchLocationList(page, rowsPerPage, Status, selectedCompany?.id_str));
      bool = true;
    }
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          {/* search by organization */}
          <Autocomplete
            fullWidth
            onKeyUp={handleFilterOrg}
            options={companies}
            value={selectedCompany}
            onChange={(_, newValue) => handleFilterValueChange(newValue)}
            getOptionLabel={(option) => option?.name}
            label="Search Organization"
            renderInput={(params) => <TextField {...params} label="Search Organization" />}
          />

          {/* search by name  */}
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            onKeyUp={handleChangeSearch}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}
