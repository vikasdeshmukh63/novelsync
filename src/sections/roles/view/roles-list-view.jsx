'use client';

import { toast } from 'sonner';
import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchRoles, deleteManyRoles } from 'src/redux/slices/roles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

import RoleModal from '../role-modal';
import RolesTableRow from '../roles-table-row';
import RolesTableFiltersResult from '../roles-table-filters-result';

// ----------------------------------------------------------------------

// status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'active', label: 'Active', statusValue: true },
  { value: 'inactive', label: 'InActive', statusValue: false },
];

// table heads
const TABLE_HEAD = [
  { id: 'role_name', label: 'Role Name' },
  { id: 'desc', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: '', label: '' },
];

// default filters
const defaultFilters = {
  status: 'all',
  jobpost: '',
};

// ----------------------------------------------------------------------

export default function RolesListView() {
  // states
  const [filters, setFilters] = useState(defaultFilters);

  const table = useTable();

  const settings = useSettingsContext();

  const dispatch = useDispatch();

  const confirm = useBoolean();

  const deleteRoles = useBoolean();

  const createRoleModal = useBoolean();

  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status)?.statusValue;

  // extracting data from redux store
  const { roles, itemCount, error } = useSelector((state) => state.roles);

  // to get the filtered data
  const dataFiltered = applyFilter({
    inputData: roles,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // to detect that can we reset
  const canReset = !isEqual(defaultFilters, filters);

  //  to detect when no data is there
  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  // select all rows
  const selectAllRows = (checked) => {
    table.onSelectAllRows(
      checked,
      dataFiltered.map((row) => row.id)
    );
  };

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

  // function to handle the status filter
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // to get initial data and data after job post filter
  useEffect(() => {
    dispatch(fetchRoles(table.page, table.rowsPerPage, status));
  }, [dispatch, status, table.page, table.rowsPerPage]);

  const handleDeletemanyRoles = async (ids) => {
    await dispatch(deleteManyRoles(ids));
    await dispatch(fetchRoles(table.page, table.rowsPerPage, status));
    deleteRoles.onTrue();
  };

  useEffect(() => {
    if (!error && deleteRoles.value) {
      toast.success('Deleted Successfully');
    }
    if (error && deleteRoles.value) {
      toast.error('Something Went Wrong');
      table.setSelected([]);
    }
    deleteRoles.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRoles.value, error]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Roles"
          links={[
            { name: 'Admin', href: paths.administration.roles },
            { name: 'Roles', href: paths.administration.roles },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <Button
              onClick={createRoleModal.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create Role
            </Button>
          }
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
            {STATUS_OPTIONS?.map((tab) => (
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {/* reset buttons */}
          {canReset && (
            <RolesTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered?.length}
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
                  dataFiltered.map((row) => row.id)
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
                {/* table head  */}
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) => selectAllRows(checked)}
                />
                <TableBody>
                  {/* table rows  */}
                  {dataFiltered?.map((row) => (
                    <RolesTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      STATUS_OPTIONS={STATUS_OPTIONS}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      status={status}
                      page={table.page}
                      rowsPerPage={table.rowsPerPage}
                      setSelected={table.setSelected}
                    />
                  ))}
                  {/* no data component  */}
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

          {/* confirm delete dialog */}
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
                  confirm.onFalse();
                  handleDeletemanyRoles(table.selected);
                }}
              >
                Delete
              </Button>
            }
          />
        </Card>
      </Container>

      {createRoleModal.value && (
        <RoleModal
          open={createRoleModal.value}
          onClose={createRoleModal.onFalse}
          type={CONSTANTS.CREATE}
          status={status}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
        />
      )}
    </DashboardContent>
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