import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { IconButton, Autocomplete } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { searchCompanies } from 'src/redux/slices/company';
import { fetchDepartmentList } from 'src/redux/slices/depatment';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export default function DepartmentTableToolbar({
  Status,
  page,
  rowsPerPage,
  filters,
  onFilters,
  selectedCompany,
  setSelectedCompany,
}) {
  const popover = usePopover();
  const dispatch = useDispatch();

  // redux
  const { error, companies } = useSelector((state) => state.company);

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

  // handling the org change value
  const handleFilterValueChange = (newValue) => {
    setSelectedCompany(newValue);
    onFilters('org', newValue ? newValue.name : '');
  };

  // debouncing and trottling for org
  useEffect(() => {
    let timer;
    if (filters.org && filters.org.length > 3 && !selectedCompany) {
      timer = setTimeout(() => {
        dispatch(searchCompanies(filters.org, Status));
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [dispatch, filters.name, filters.org, page, rowsPerPage, selectedCompany, Status]);

  const handleChangeSearch = (event) => {
    const name = event.target.value;
    let bool = true;
    if (name) {
      bool = false;
    }

    if (name === '' && !bool) {
      dispatch(fetchDepartmentList(page + 1, rowsPerPage, Status, selectedCompany?.id_str));
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
          <FormControl sx={{ width: 1 }}>
            <Autocomplete
              disablePortal
              value={selectedCompany}
              onKeyUp={handleFilterOrg}
              options={companies}
              getOptionLabel={(option) => option?.name}
              onChange={(_, value) => handleFilterValueChange(value)}
              renderInput={(params) => <TextField {...params} label="Search by Organization" />}
            />
          </FormControl>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            onKeyUp={handleChangeSearch}
            value={filters.name}
            onChange={handleFilterName}
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