'use client';

import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

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

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles } from 'src/_mock';
import { CONSTANTS } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  deleteDepartment,
  fetchDepartmentList,
  searchDepartmentList,
  deleteDepartmentByRowSelect,
} from 'src/redux/slices/depatment';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
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

import DepartmentTableRow from '../department-table-row';
import DepartmentTableToolbar from '../department-table-toolbar';
import DepartmentQuickEditForm from '../department-quick-edit-form';
import DepartmentTableFiltersResult from '../department-table-filters-result';

// ----------------------------------------------------------------------

// status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'active', label: 'Active', statusValue: true },
  { value: 'inactive', label: 'Inactive', statusValue: false },
];

// tabel header options
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'parentName', label: 'Parent Name', width: 180 },
  { id: 'organization', label: 'Organization', width: 220 },
  { id: 'location', label: 'Location', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// default values for filters
const defaultFilters = {
  status: 'all',
  name: '',
  org: '',
};

// ----------------------------------------------------------------------

export default function DepartmentListView() {
  // states
  const [isDeleted, setIsDeleted] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // custom hooks
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const openAdd = useBoolean();
  const table = useTable();

  // extracting data from redux
  const dispatch = useDispatch();
  const { departments, itemCount, error } = useSelector((state) => state.departments);
  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status).statusValue;

  // to get the filtered data
  const dataFiltered = applyFilter({
    inputData: departments,
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
    await dispatch(deleteDepartment(id));
    if (!filters.name) {
      // Fetch department list
      dispatch(
        fetchDepartmentList(table.page + 1, table.rowsPerPage, status, selectedCompany?.id_str)
      );
    } else if (filters.name.length > 2) {
      // Search department list by name
      dispatch(searchDepartmentList(table.page + 1, table.rowsPerPage, status, filters.name));
    }
    setIsDeleted(true);
  };

  // function to delete multiple rows
  const handleDeleteMultipleRows = async () => {
    await dispatch(deleteDepartmentByRowSelect(table.selected));
    if (!filters.name) {
      // Fetch department list
      dispatch(
        fetchDepartmentList(table.page + 1, table.rowsPerPage, status, selectedCompany?.id_str)
      );
    } else if (filters.name.length > 2) {
      // Search department list by name
      dispatch(searchDepartmentList(table.page + 1, table.rowsPerPage, status, filters.name));
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

  // function to clear the autocomplete
  const handleClearAutoComplete = async () => {
    setSelectedCompany(null);
  };

  useEffect(() => {
    let timer;
    if (!filters.name) {
      // Fetch department list
      dispatch(
        fetchDepartmentList(table.page + 1, table.rowsPerPage, status, selectedCompany?.id_str)
      );
    } else if (filters.name.length > 2) {
      // Search department list by name
      timer = setTimeout(() => {
        dispatch(searchDepartmentList(table.page + 1, table.rowsPerPage, status, filters.name));
      }, 200);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, status, table.page, table.rowsPerPage, selectedCompany?.id_str, filters.name]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* add form  */}
        {openAdd.value && (
          <DepartmentQuickEditForm
            Status={status}
            selectedCompany={selectedCompany}
            page={table.page}
            type={CONSTANTS.CREATE}
            rowsPerPage={table.rowsPerPage}
            table={table}
            filters={filters}
            open={openAdd.value}
            onClose={openAdd.onFalse}
          />
        )}

        <CustomBreadcrumbs
          heading="Departments List"
          links={[
            { name: 'Management', href: paths.management.departments },
            { name: 'Departments', href: paths.management.departments },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={openAdd.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Department
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
            {STATUS_OPTIONS?.map((tab) => (
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
          <DepartmentTableToolbar
            Status={status}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            dataFiltered={dataFiltered}
            filters={filters}
            onFilters={handleFilters}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            roleOptions={_roles}
          />

          {/* reset buttons */}
          {canReset && (
            <DepartmentTableFiltersResult
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              filters={filters}
              onFilters={handleFilters}
              handleClearAutoComplete={handleClearAutoComplete}
              onResetFilters={handleResetFilters}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              status={status}
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
                    <DepartmentTableRow
                      key={row.id_str}
                      selectedCompany={selectedCompany}
                      row={row}
                      Status={status}
                      page={table.page}
                      rowsPerPage={table.rowsPerPage}
                      filters={filters}
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
            //
            dense={table.dense}
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
              handleDeleteMultipleRows();
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
