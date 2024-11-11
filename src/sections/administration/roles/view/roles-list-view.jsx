'use client';

import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
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

import { CONSTANTS } from 'src/constants';
import { _roles, _userList } from 'src/_mock';
import {
  deleteRoles,
  fetchRolesList,
  deleteRolesByRowSelect,
  searchRoleByQuery,
} from 'src/redux/slices/roles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import RolesTableRow from '../roles-table-row';
import RolesTableToolbar from '../roles-table-toolbar';
import RolesQuickEditForm from '../roles-quick-edit-form';
import RolesTableFiltersResult from '../roles-table-filters-result';
import { toast } from 'sonner';
import { Scrollbar } from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'active', label: 'Active', statusValue: true },
  { value: 'inactive', label: 'Inactive', statusValue: false },
];

// default values for filters
const defaultFilters = {
  status: 'all',
  name: '',
};

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 100 },
  { id: 'description', label: 'Description', width: 180 },
  { id: 'status', label: 'Status', width: 50 },
  { id: '', width: 50 },
];

// ----------------------------------------------------------------------

export default function RolesListView() {
  // states
  const [isDeleted, setIsDeleted] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  // custom  hooks
  const table = useTable();
  const openAdd = useBoolean();
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const confirm = useBoolean();

  // accessing roles from redux
  const { roles, itemCount, error } = useSelector((state) => state.roles);

  // to find status value
  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status).statusValue;

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
    await dispatch(deleteRoles(id));
    if (!filters.name) {
      await dispatch(fetchRolesList(table.page + 1, table.rowsPerPage, status));
    } else if (filters.name && filters.name.length > 2) {
      await dispatch(searchRoleByQuery(table.page + 1, table.rowsPerPage, filters.name, status));
    }
    setIsDeleted(true);
  };

  // function to delete multiple rows
  const handleDeleteRows = async () => {
    console.log(table.selected);
    await dispatch(deleteRolesByRowSelect(table.selected));
    if (!filters.name) {
      await dispatch(fetchRolesList(table.page + 1, table.rowsPerPage, status));
    } else if (filters.name && filters.name.length > 2) {
      await dispatch(searchRoleByQuery(table.page + 1, table.rowsPerPage, filters.name, status));
    }
    setIsDeleted(true);
    table.setSelected([]);
  };

  // to show the notifications for delete operations
  useEffect(() => {
    if (isDeleted && error) {
      toast.error('Unable to Delete!', { variant: 'error' });
      setIsDeleted(false);
    }
    if (isDeleted && !error) {
      toast.success('Delete success!');
      setIsDeleted(false);
    }
  }, [error, isDeleted]);

  // function to handle the status filter
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // to get Industries list based on filter and initially
  useEffect(() => {
    let timer;
    if (!filters.name) {
      dispatch(fetchRolesList(table.page + 1, table.rowsPerPage, status));
    } else if (filters.name && filters.name.length > 2) {
      timer = setTimeout(() => {
        dispatch(searchRoleByQuery(table.page + 1, table.rowsPerPage, filters.name, status));
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [dispatch, filters.name, status, table.page, table.rowsPerPage]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* add form  */}
        {openAdd.value && (
          <RolesQuickEditForm
            filters={filters}
            Status={status}
            page={table.page}
            type={CONSTANTS.CREATE}
            rowsPerPage={table.rowsPerPage}
            open={openAdd.value}
            onClose={openAdd.onFalse}
          />
        )}
        <CustomBreadcrumbs
          heading="Roles List"
          links={[
            { name: 'Administration', href: paths.administration.roles },
            { name: 'Roles', href: paths.administration.roles },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={openAdd.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Roles
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
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
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
          <RolesTableToolbar
            Status={status}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            filters={filters}
            onFilters={handleFilters}
            roleOptions={_roles}
          />
          {/* reset buttons */}
          {canReset && (
            <RolesTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
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
                  dataFiltered?.map((row) => row.id_str)
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
                      dataFiltered?.map((row) => row.id_str)
                    )
                  }
                />

                <TableBody>
                  {/* table rows  */}
                  {dataFiltered?.map((row) => (
                    <RolesTableRow
                      key={row.id_str}
                      filters={filters}
                      row={row}
                      page={table.page}
                      rowsPerPage={table.rowsPerPage}
                      Status={status}
                      selected={table.selected.includes(row.id_str)}
                      onSelectRow={() => table.onSelectRow(row.id_str)}
                      onDeleteRow={() => handleDeleteRow(row.id_str)}
                    />
                  ))}

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
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  return inputData;
}
