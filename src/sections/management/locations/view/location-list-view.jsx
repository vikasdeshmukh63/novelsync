'use client';

import { toast } from 'sonner';
import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles } from 'src/_mock';
import { CONSTANTS } from 'src/constants';
import {
  searchLocations,
  fetchLocationList,
  deleteSingleLocation,
  deleteMultipleLocations,
} from 'src/redux/slices/locations';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import LocationsTableRow from '../location-table-row';
import LocationTableToolbar from '../location-table-toolbar';
import LocationQuickEditForm from '../location-quick-edit-form';
import LocationTableFiltersResult from '../location-table-filters-result';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'active', label: 'Active', statusValue: true },
  { value: 'inactive', label: 'Inactive', statusValue: false },
];

// table heads
const TABLE_HEAD = [
  { id: 'address', label: 'Address' },
  { id: 'name', label: 'Name', width: 180 },
  { id: 'company', label: 'Company', width: 220 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// default filters
const defaultFilters = {
  status: 'all',
  name: '',
  org: '',
};

// ----------------------------------------------------------------------

export default function LocationListView() {
  // states
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const dispatch = useDispatch();

  const confirm = useBoolean();

  const openAdd = useBoolean();

  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status).statusValue;

  // extracting data from redux store
  const { locations, itemCount, error } = useSelector((state) => state.locations);

  // to get the filtered data
  const dataFiltered = applyFilter({
    inputData: locations,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // to detect that can we reset
  const canReset = !isEqual(defaultFilters, filters);

  //  to detect when no data is there
  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  // function to handle filters
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // function to reset filter
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // function to delete single row
  const handleDeleteRow = async (id) => {
    await dispatch(deleteSingleLocation(id));
    if (!filters.name) {
      // fetch department list
      dispatch(fetchLocationList(table.page, table.rowsPerPage, status, selectedCompany?.id_str));
    } else if (filters.name.length > 2) {
      // search department list by name
      dispatch(searchLocations(filters.name, status));
    }
    setIsDeleted(true);
  };

  // function to delete multiple rows
  const handleDeleteRows = async (id) => {
    await dispatch(deleteMultipleLocations(id));
    if (!filters.name) {
      // fetch department list
      dispatch(fetchLocationList(table.page, table.rowsPerPage, status, selectedCompany?.id_str));
    } else if (filters.name.length > 2) {
      // search department list by name
      dispatch(searchLocations(filters.name, status));
    }
    setIsDeleted(true);
    table.setSelected([]);
  };

  // function to handle the status filter
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // to show the notifications for delete operations
  useEffect(() => {
    if (isDeleted && !error) {
      toast.success('Location Deleted Successfully');
      setIsDeleted(false);
    }
    if (isDeleted && error) {
      toast.error('Error Deleting Location', { variant: 'error' });
      setIsDeleted(false);
    }
  }, [isDeleted, error]);

  // function to clear the autocomplete
  const handleClearAutoComplete = () => {
    setSelectedCompany(null);
    handleFilters('org', '');
  };

  // fetching the initial data
  useEffect(() => {
    if (!filters.name) {
      // fetch department list
      dispatch(fetchLocationList(table.page, table.rowsPerPage, status, selectedCompany?.id_str));
    } else if (filters.name.length > 2) {
      // search department list by name
      dispatch(searchLocations(filters.name, status));
    }
  }, [table.page, table.rowsPerPage, status, dispatch, filters.name, selectedCompany?.id_str]);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          {/* edit form  */}
          <LocationQuickEditForm
            filters={filters}
            open={openAdd.value}
            onClose={openAdd.onFalse}
            type={CONSTANTS.CREATE}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            Status={status}
          />
          <CustomBreadcrumbs
            heading="Location List"
            links={[
              { name: 'Management', href: paths.management.locations },
              { name: 'Locations', href: paths.management.locations },
              { name: 'List' },
            ]}
            action={
              <Button
                onClick={openAdd.onTrue}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Location
              </Button>
            }
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          <Card>
            <Tabs
              value={filters.status}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                        'soft'
                      }
                      color={
                        (tab.value === 'active' && 'success') ||
                        (tab.value === 'inactive' && 'error') ||
                        'default'
                      }
                    >
                      {tab.value === filters.status ? dataFiltered?.length : 0}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            {/* table toolbar  */}
            <LocationTableToolbar
              filters={filters}
              onFilters={handleFilters}
              roleOptions={_roles}
              rowsPerPage={table.rowsPerPage}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              page={table.page}
              Status={status}
            />

            {/* reset buttons */}
            {canReset && (
              <LocationTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                onResetFilters={handleResetFilters}
                results={dataFiltered?.length}
                handleClearAutoComplete={handleClearAutoComplete}
                setSelectedCompany={setSelectedCompany}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id_str)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered?.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row.id_str)
                      )
                    }
                  />

                  <TableBody>
                    {/* table rows  */}
                    {dataFiltered?.map((row) => (
                      <LocationsTableRow
                        key={row.id_str}
                        row={row}
                        selected={table.selected.includes(row.id_str)}
                        onSelectRow={() => table.onSelectRow(row.id_str)}
                        onDeleteRow={() => handleDeleteRow(row.id_str)}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        Status={status}
                        filters={filters}
                        selectedCompany={selectedCompany}
                      />
                    ))}
                    {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  /> */}
                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* table pagination  */}
            <TablePaginationCustom
              count={itemCount}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              // onChangeDense={table.onChangeDense}
            />
          </Card>
        </Container>

        {/* confirmation dialog box  */}
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content={
            <>
              Are you sure want to delete <strong> {table.selected.length} </strong> items?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteRows(table.selected);
                confirm.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </DashboardContent>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  return inputData;
}
