'use client';

import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { Pagination, Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { _userCards } from 'src/_mock';
import { fetchCustomersList, searchCustomersList, setCustomers } from 'src/redux/slices/customers';

import { Iconify } from 'src/components/iconify';
import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AddEmployeesModal from '../AddEmployeesModal';
import EmployeeCardList from '../employee-card-list';
import EmployeeTableToolbar from '../employee-table-toolbar';
import EmployeeTableFiltersResult from '../employee-table-filters-result';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
};
export default function EmployeeListView() {
  const [filters, setFilters] = useState(defaultFilters);
  const settings = useSettingsContext();
  const { itemCount } = useSelector((state) => state.customers);
  const table = useTable({ defaultCurrentPage: 1, defaultRowsPerPage: 6 });
  const openAdd = useBoolean();
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (!filters.name) {
      dispatch(setCustomers([]));
      dispatch(fetchCustomersList(table.page, table.rowsPerPage));
    } else if (filters.name && filters.name.length > 2) {
      timer = setTimeout(() => {
        // debouncing and trottling to reduce number of api calls on searching

        dispatch(searchCustomersList(table.page, table.rowsPerPage, filters.name));
      }, 200);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, filters.name, table.page, table.rowsPerPage]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !isEqual(defaultFilters, filters);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* add employees modal  */}
        <AddEmployeesModal modalState={openAdd} />
        <CustomBreadcrumbs
          heading="Employees List"
          links={[
            { name: 'Overview', href: paths.dashboard.root },
            { name: 'Employees', href: paths.employees },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={openAdd.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Employees
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <EmployeeTableToolbar filters={filters} onFilters={handleFilters} />
        <Box sx={{ p: 2.5, pt: 0 }}>
          <Typography variant="body1">
            Found <span style={{ color: 'green', fontWeight: 800 }}>{itemCount}</span> employees
          </Typography>
        </Box>

        {canReset && (
          <EmployeeTableFiltersResult
            filters={filters}
            results={itemCount}
            sx={{ p: 2.5, pt: 0 }}
            onResetFilters={handleResetFilters}
          />
        )}
        <EmployeeCardList />

        <Box display="flex" justifyContent="center" my={2}>
          <Pagination
            page={table.page}
            shape="circular"
            onChange={table.onChangePage}
            count={Math.ceil(itemCount / table.rowsPerPage)}
            variant="text"
          />
        </Box>
      </Container>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
